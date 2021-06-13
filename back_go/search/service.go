package main

import (
	"context"
	"io"

	//"log"
	"net/http"
	"search/searchstore"
	"strings"

	"github.com/nikolablesic/proto/helloworld"
	"github.com/nikolablesic/proto/search"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"

	tracer "github.com/milossimic/grpc_rest/tracer"
	otgo "github.com/opentracing/opentracing-go"
	"github.com/opentracing/opentracing-go/ext"
	log "github.com/sirupsen/logrus"
)

var grpcGatewayTag = otgo.Tag{Key: string(ext.Component), Value: "grpc-gateway"}

func tracingWrapper(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		parentSpanContext, err := otgo.GlobalTracer().Extract(
			otgo.HTTPHeaders,
			otgo.HTTPHeadersCarrier(r.Header))
		if err == nil || err == otgo.ErrSpanContextNotFound {
			serverSpan := otgo.GlobalTracer().StartSpan(
				"ServeHTTP",
				// this is magical, it attaches the new span to the parent parentSpanContext, and creates an unparented one if empty.
				ext.RPCServerOption(parentSpanContext),
				grpcGatewayTag,
			)
			r = r.WithContext(otgo.ContextWithSpan(r.Context(), serverSpan))
			defer serverSpan.Finish()
		}
		h.ServeHTTP(w, r)
		log.WithFields(log.Fields{
			"method":   r.Method,
			"path":     r.URL,
			"agent":    r.UserAgent(),
			"response": r.Response,
			"host":     r.Host,
			"proto":    r.Proto,
			"service":  "search",
		}).Info("request details")
	})
}

const name = "search_service"

type server struct {
	search.UnimplementedSearchServer
	postClient helloworld.GreeterClient
	store      *searchstore.SearchStore
	tracer     otgo.Tracer
	closer     io.Closer
}

func NewServer(postClient helloworld.GreeterClient) (*server, error) {
	store, err := searchstore.New()
	if err != nil {
		log.Error(err)
		return nil, err
	}

	tracer, closer := tracer.Init(name)
	otgo.SetGlobalTracer(tracer)
	return &server{
		store:      store,
		tracer:     tracer,
		closer:     closer,
		postClient: postClient,
	}, nil
}

func (s *server) GetTracer() otgo.Tracer {
	log.Info(s.tracer)
	return s.tracer
}

func (s *server) GetCloser() io.Closer {
	log.Info(s.closer)
	return s.closer
}

func (s *server) PostInfoRequest(ctx context.Context, in *search.CreatePostInfoRequest) (*search.Identifier, error) {
	return s.store.CreatePostInfo(ctx, in)
}

func (s *server) StoryInfoRequest(ctx context.Context, in *search.CreateStoryInfoRequest) (*search.Identifier, error) {
	return s.store.CreateStoryInfo(ctx, in)
}

func (s *server) GetStoriesByUsernameRequest(ctx context.Context, in *search.ActionRequest) (*search.Stories, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &search.Stories{}, status.Error(401, "401 Unauthorized")
	}
	storiesInfo, _ := s.store.GetStoriesByUsername(ctx, in)

	ids := []int32{}
	for _, story := range storiesInfo {
		ids = append(ids, int32(story.PostID))
	}
	stories, err := s.postClient.GetStoriesByIdsRequest(ctx, &helloworld.Ids{Ids: ids, Username: username})
	return convertGetAllStoriesToStories(stories), err
}

func (s *server) GetStoriesForUserRequest(ctx context.Context, in *search.ActionRequest) (*search.Stories, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &search.Stories{}, status.Error(401, "401 Unauthorized")
	}
	//TODO: Iz usera follow lista
	usernames := GetFollowList(username)
	storiesInfo, _ := s.store.GetStoriesByUsernames(ctx, usernames)

	ids := []int32{}
	for _, story := range storiesInfo {
		if contains(usernames, story.Username) {
			ids = append(ids, int32(story.PostID))
		}
	}
	if len(ids) <= 0 {
		return &search.Stories{}, nil
	}
	stories, err := s.postClient.GetStoriesByIdsRequest(ctx, &helloworld.Ids{Ids: ids, Username: username})

	if err != nil {
		log.Error(err)
	}

	return convertGetAllStoriesToStories(stories), err
}

func (s *server) GetPostsByUsernameRequest(ctx context.Context, in *search.ActionRequest) (*search.Posts, error) {
	postsInfo, _ := s.store.GetPostsByUsername(ctx, in)

	ids := []int32{}
	for _, post := range postsInfo {
		ids = append(ids, int32(post.PostID))
	}
	posts, err := s.postClient.GetPostsByIdsRequest(ctx, &helloworld.Ids{Ids: ids})

	if err != nil {
		log.Error(err)
	}

	return convertGetAllPostsToPosts(posts), err
}

func (s *server) GetNewsFeedForUsernameRequest(ctx context.Context, in *search.ActionRequest) (*search.Posts, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &search.Posts{}, status.Error(401, "401 Unauthorized")
	}
	in.Filter = username
	//TODO: Iz usera follow lista
	usernames := GetFollowList(username)
	postsInfo, _ := s.store.GetPostsByUsernames(ctx, usernames)

	ids := []int32{}
	for _, post := range postsInfo {
		if contains(usernames, post.Username) {
			ids = append(ids, int32(post.PostID))
		}
	}
	if len(ids) <= 0 {
		return &search.Posts{}, nil
	}
	posts, err := s.postClient.GetPostsByIdsRequest(ctx, &helloworld.Ids{Ids: ids})

	if err != nil {
		log.Error(err)
	}

	return convertGetAllPostsToPosts(posts), err
}

func (s *server) GetPostsByLocationRequest(ctx context.Context, in *search.ActionRequest) (*search.Posts, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &search.Posts{}, status.Error(401, "401 Unauthorized")
	}
	posts, _ := s.postClient.GetPostsByLocationRequest(ctx, &helloworld.Filter{Filter: in.Filter})

	//TODO: Iz usera follow lista + javni
	usernames := GetFollowListAndPublic(username)
	list := []*helloworld.Post{}

	for _, post := range posts.Posts {
		if contains(usernames, post.Username) {
			list = append(list, post)
		}
	}

	return convertGetAllPostsToPosts(&helloworld.GetAllPosts{
		Posts: list,
	}), nil
}

func (s *server) GetPostsByHashtagRequest(ctx context.Context, in *search.ActionRequest) (*search.Posts, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &search.Posts{}, status.Error(401, "401 Unauthorized")
	}
	posts, _ := s.postClient.GetPostsByHashtagRequest(ctx, &helloworld.Filter{Filter: in.Filter})

	//TODO: Iz usera follow lista + javni
	usernames := GetFollowListAndPublic(username)
	list := []*helloworld.Post{}

	for _, post := range posts.Posts {
		if contains(usernames, post.Username) {
			list = append(list, post)
		}
	}

	return convertGetAllPostsToPosts(&helloworld.GetAllPosts{
		Posts: list,
	}), nil
}

func (s *server) GetPostsByTagRequest(ctx context.Context, in *search.ActionRequest) (*search.Posts, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &search.Posts{}, status.Error(401, "401 Unauthorized")
	}
	posts, _ := s.postClient.GetPostsByTagRequest(ctx, &helloworld.Filter{Filter: in.Filter})

	//Iz usera follow lista + javni
	usernames := GetFollowListAndPublic(username)
	list := []*helloworld.Post{}

	for _, post := range posts.Posts {
		if contains(usernames, post.Username) {
			list = append(list, post)
		}
	}

	return convertGetAllPostsToPosts(&helloworld.GetAllPosts{
		Posts: list,
	}), nil
}

func (s *server) GetStoriesByLocationRequest(ctx context.Context, in *search.ActionRequest) (*search.Stories, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &search.Stories{}, status.Error(401, "401 Unauthorized")
	}
	stories, _ := s.postClient.GetStoriesByLocationRequest(ctx, &helloworld.Filter{Filter: in.Filter})

	//TODO: Iz usera follow lista + javni
	usernames := GetFollowListAndPublic(username)
	list := []*helloworld.Story{}

	for _, story := range stories.Stories {
		if contains(usernames, story.Username) {
			list = append(list, story)
		}
	}

	return convertGetAllStoriesToStories(&helloworld.GetAllStories{
		Stories: list,
	}), nil
}

func (s *server) GetStoriesByHashtagRequest(ctx context.Context, in *search.ActionRequest) (*search.Stories, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &search.Stories{}, status.Error(401, "401 Unauthorized")
	}
	stories, _ := s.postClient.GetStoriesByHashtagRequest(ctx, &helloworld.Filter{Filter: in.Filter})

	//TODO: Iz usera follow lista + javni
	usernames := GetFollowListAndPublic(username)
	list := []*helloworld.Story{}

	for _, story := range stories.Stories {
		if contains(usernames, story.Username) {
			list = append(list, story)
		}
	}

	return convertGetAllStoriesToStories(&helloworld.GetAllStories{
		Stories: list,
	}), nil
}

func (s *server) GetStoriesByTagRequest(ctx context.Context, in *search.ActionRequest) (*search.Stories, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &search.Stories{}, status.Error(401, "401 Unauthorized")
	}
	stories, _ := s.postClient.GetStoriesByTagRequest(ctx, &helloworld.Filter{Filter: in.Filter})

	//Iz usera follow lista + javni
	usernames := GetFollowListAndPublic(username)
	list := []*helloworld.Story{}

	for _, story := range stories.Stories {
		if contains(usernames, story.Username) {
			list = append(list, story)
		}
	}

	return convertGetAllStoriesToStories(&helloworld.GetAllStories{
		Stories: list,
	}), nil
}

func (s *server) IsPostLikedRequest(ctx context.Context, in *search.IsLikedRequest) (*search.IsPostLikedResponse, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &search.IsPostLikedResponse{}, status.Error(401, "401 Unauthorized")
	}
	in.Username = username
	ids := []int32{}
	ids = append(ids, int32(in.PostId))
	posts, err := s.postClient.GetPostsByIdsRequest(ctx, &helloworld.Ids{Ids: ids})

	for _, post := range posts.Posts {
		for _, like := range post.Likes {
			if like == in.Username {
				return &search.IsPostLikedResponse{
					IsLiked: true,
				}, err
			}
		}
	}

	return &search.IsPostLikedResponse{
		IsLiked: false,
	}, err
}

func (s *server) IsPostDislikedRequest(ctx context.Context, in *search.IsLikedRequest) (*search.IsPostLikedResponse, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &search.IsPostLikedResponse{}, status.Error(401, "401 Unauthorized")
	}
	in.Username = username
	ids := []int32{}
	ids = append(ids, int32(in.PostId))
	posts, err := s.postClient.GetPostsByIdsRequest(ctx, &helloworld.Ids{Ids: ids})

	for _, post := range posts.Posts {
		for _, like := range post.Dislikes {
			if like == in.Username {
				return &search.IsPostLikedResponse{
					IsLiked: true,
				}, err
			}
		}
	}

	return &search.IsPostLikedResponse{
		IsLiked: false,
	}, err
}

func (s *server) GetCommentsRequest(ctx context.Context, in *search.GetComments) (*search.Comments, error) {
	ids := []int32{}
	ids = append(ids, in.PostId)
	posts, err := s.postClient.GetPostsByIdsRequest(ctx, &helloworld.Ids{Ids: ids})

	if err != nil {
		log.Error(err)
	}

	for _, post := range posts.Posts {
		return &search.Comments{
			Comments: convertComments(post.Comments),
		}, nil
	}

	return &search.Comments{}, err
}

func (s *server) SearchProfilesRequest(ctx context.Context, in *search.ActionRequest) (*search.Users, error) {
	//TODO: lista usera

	ret := []*search.User{}
	if strings.Contains("nikolablesic", in.Filter) {
		ret = append(ret, &search.User{
			Name:           "Nikola Blesic",
			Username:       "nikolablesic",
			UserProfilePic: "https://www.gettyimages.com/gi-resources/images/500px/983794168.jpg",
		})
	}
	if strings.Contains("helenanisic", in.Filter) {
		ret = append(ret, &search.User{
			Name:           "Helena Anisic",
			Username:       "helenanisic",
			UserProfilePic: "https://drscdn.500px.org/photo/53713630/m%3D900/v2?sig=0bb4d582aa994ae89d7762015f5c94f6088dcacdacc1bda07dff39be2e982809",
		})
	}
	if strings.Contains("mihailoivic", in.Filter) {
		ret = append(ret, &search.User{
			Name:           "Mihailo Ivic",
			Username:       "mihailoivic",
			UserProfilePic: "https://iso.500px.com/wp-content/uploads/2015/01/weather_cover-1500x1000.jpg",
		})
	}
	if strings.Contains("jovantimarac", in.Filter) {
		ret = append(ret, &search.User{
			Name:           "Jovan Timarac",
			Username:       "jovantimarac",
			UserProfilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqAU2U9F2b3_pn-jOQyP4gfs-NsAR36r1qOe05GyTqkJRjC4fBh4equLdIeJBeIeRBLtk&usqp=CAU",
		})
	}

	return &search.Users{
		Users: ret,
	}, nil
}

func GetFollowList(username string) []string {
	ret := []string{}
	ret = append(ret, "username")
	return ret
}

func GetFollowListAndPublic(username string) []string {
	ret := []string{}
	ret = append(ret, "username")
	ret = append(ret, "username1")
	return ret
}

func contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}
	return false
}

func convertGetAllStoriesToStories(getAllStories *helloworld.GetAllStories) *search.Stories {
	return &search.Stories{
		Stories: convertStories(getAllStories.Stories),
	}
}

func convertStories(stories []*helloworld.Story) []*search.Story {
	ret := []*search.Story{}
	for _, story := range stories {
		ret = append(ret, convertStory(story))
	}
	return ret
}

func convertStory(story *helloworld.Story) *search.Story {
	return &search.Story{
		Id:               story.Id,
		Name:             "ime",
		Username:         story.Username,
		UserProfilePic:   "slika",
		LocationName:     story.LocationName,
		Description:      story.Description,
		CreatedAt:        story.CreatedAt,
		Hashtags:         story.Hashtags,
		Tags:             story.Tags,
		ImageUrls:        story.ImageUrls,
		OnlyCloseFriends: story.OnlyCloseFriends,
		IsHighlight:      story.IsHighlight,
	}
}

func convertGetAllPostsToPosts(getAllPosts *helloworld.GetAllPosts) *search.Posts {
	return &search.Posts{
		Posts: convertPosts(getAllPosts.Posts),
	}
}

func convertPosts(posts []*helloworld.Post) []*search.Post {
	ret := []*search.Post{}
	for _, post := range posts {
		ret = append(ret, convertPost(post))
	}
	return ret
}

func convertPost(post *helloworld.Post) *search.Post {
	return &search.Post{
		Id:               post.Id,
		Name:             "ime",
		Username:         post.Username,
		UserProfilePic:   "slika",
		LocationName:     post.LocationName,
		Description:      post.Description,
		CreatedAt:        post.CreatedAt,
		Hashtags:         post.Hashtags,
		Tags:             post.Tags,
		ImageUrls:        post.ImageUrls,
		NumberOfLikes:    int32(len(post.Likes)),
		NumberOfDislikes: int32(len(post.Dislikes)),
	}
}

func convertComments(comments []*helloworld.Comment) []*search.Comment {
	ret := []*search.Comment{}
	for _, comment := range comments {
		ret = append(ret, convertComment(comment))
	}
	return ret
}

func convertComment(comment *helloworld.Comment) *search.Comment {
	return &search.Comment{
		Id:       comment.Id,
		Content:  comment.Content,
		Username: comment.Username,
		PostId:   comment.PostId,
	}
}

func GetUsernameOfLoggedUser(ctx context.Context) string {

	md, _ := metadata.FromIncomingContext(ctx)
	var token string
	if len(md["authorization"]) > 0 {
		token = md["authorization"][0]
	} else {
		return ""
	}
	return GetUsernameFromToken(token)
}

func GetUsernameFromToken(token string) string {
	return "nikolablesic"
	/*resp, _ := http.Get("https://bezbednost:8443/auth/getUsernameByToken/" + token)
	defer resp.Body.Close()
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println(string(b))
	return string(b)*/
}
