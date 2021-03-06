package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"strconv"
	"strings"
	"time"

	//"log"
	"net/http"
	"post/poststore"
	"post/saga"

	"github.com/nikolablesic/proto/helloworld"
	"github.com/nikolablesic/proto/search"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"

	"github.com/go-redis/redis"
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
			"service":  "post",
		}).Info("request details")
	})
}

func (os *server) RedisConnection() {
	// create client and ping redis
	var err error
	fmt.Println("Krecem redis")
	client := redis.NewClient(&redis.Options{Addr: "redis:6379", Password: "", DB: 0})
	fmt.Println("Port prosao")
	if _, err = client.Ping().Result(); err != nil {
		fmt.Println("error creating redis client %s", err)
	}

	// subscribe to the required channels
	pubsub := client.Subscribe(saga.PostChannel, saga.ReplyChannel)
	if _, err = pubsub.Receive(); err != nil {
		fmt.Println("error subscribing %s", err)
	}
	defer func() { _ = pubsub.Close() }()
	ch := pubsub.Channel()

	fmt.Println("starting the post service")
	for {
		select {
		case msg := <-ch:
			m := saga.Message{}
			err := json.Unmarshal([]byte(msg.Payload), &m)
			if err != nil {
				fmt.Println(err)
				continue
			}
			fmt.Println("***")
			fmt.Println("kanal " + msg.Channel)
			fmt.Println("reportId " + strconv.Itoa(m.ReportId))
			fmt.Println("publicationId " + strconv.Itoa(m.PublicationId))
			fmt.Println("publicationType " + m.PublicationType)
			fmt.Println("***")

			switch msg.Channel {
			case saga.PostChannel:

				// Happy Flow
				if m.Action == saga.ActionStart {
					// Check quantity of products
					//p := m.Products
					m.Ok = os.store.PublicationExists(m.PublicationId, m.PublicationType)
					fmt.Printf("Current Unix Time: %v\n", time.Now().Unix())
					time.Sleep(20 * time.Second)
					fmt.Printf("Current Unix Time: %v\n", time.Now().Unix())
					//provera da li je postoji objava
					sendToReplyChannel(client, &m, saga.ActionDone, saga.ServiceAdmin, saga.ServicePost)
					// Simulate rollback from stock-service
					// sendToReplyChannel(client, &m, saga.ActionError, saga.ServiceOrder, saga.ServiceStock)
				}

				// Rollback flow
				if m.Action == saga.ActionRollback {
					// nema sta
				}

			}
		}
	}
}

func sendToReplyChannel(client *redis.Client, m *saga.Message, action string, service string, senderService string) {
	var err error
	m.Action = action
	m.Service = service
	m.SenderService = senderService
	if err = client.Publish(saga.ReplyChannel, m).Err(); err != nil {
		log.Printf("error publishing done-message to %s channel", saga.ReplyChannel)
	}
	log.Printf("done message published to channel :%s", saga.ReplyChannel)
}

type server struct {
	helloworld.UnimplementedGreeterServer
	searchClient search.SearchClient
	store        *poststore.PostStore
	tracer       otgo.Tracer
	closer       io.Closer
}

const name = "post_service"

func NewServer(searchClient search.SearchClient) (*server, error) {
	store, err := poststore.New()
	if err != nil {
		log.Error(err)
		return nil, err
	}

	tracer, closer := tracer.Init(name)
	otgo.SetGlobalTracer(tracer)
	return &server{
		store:        store,
		tracer:       tracer,
		closer:       closer,
		searchClient: searchClient,
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

func (s *server) PostRequest(ctx context.Context, in *helloworld.CreatePostRequest) (*helloworld.Identifier, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &helloworld.Identifier{}, status.Error(401, "401 Unauthorized")
	}
	in.Post.Username = username
	for _, tag := range in.Post.Tags {
		resp, err := http.Get("http://user_service:23002/canITag/" + tag)
		if err != nil {
			fmt.Println(err)
		}
		if resp.StatusCode != 200 {
			return &helloworld.Identifier{}, errors.New("ne mozete tagovati " + tag)
		}
		defer resp.Body.Close()
	}
	id, err := s.store.CreatePost(ctx, in)
	s.searchClient.PostInfoRequest(ctx, &search.CreatePostInfoRequest{
		PostInfo: &search.PostInfo{
			Username:  in.Post.Username,
			PostId:    id.Id,
			CreatedAt: in.Post.CreatedAt,
		},
	})
	if err != nil {
		log.Error(err)
	}
	return id, err
}

func (s *server) GetPostRequest(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.Post, error) {
	return s.store.GetPost(ctx, int(in.PostId))
}

func (s *server) GetAllPostsRequest(ctx context.Context, in *helloworld.EmptyRequest) (*helloworld.GetAllPosts, error) {
	return s.store.GetAllPosts(ctx)
}

func (s *server) GetPostsByHashtagRequest(ctx context.Context, in *helloworld.Filter) (*helloworld.GetAllPosts, error) {
	return s.store.GetPostsByHashtag(ctx, in)
}

func (s *server) GetPostsByTagRequest(ctx context.Context, in *helloworld.Filter) (*helloworld.GetAllPosts, error) {
	return s.store.GetPostsByTag(ctx, in)
}

func (s *server) GetPostsByLocationRequest(ctx context.Context, in *helloworld.Filter) (*helloworld.GetAllPosts, error) {
	return s.store.GetPostsByLocation(ctx, in)
}

func (s *server) GetLikedPostsRequest(ctx context.Context, in *helloworld.EmptyRequest) (*helloworld.GetAllPosts, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &helloworld.GetAllPosts{}, status.Error(401, "401 Unauthorized")
	}
	return s.store.GetLikedPosts(ctx, username)
}

func (s *server) GetDislikedPostsRequest(ctx context.Context, in *helloworld.EmptyRequest) (*helloworld.GetAllPosts, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &helloworld.GetAllPosts{}, status.Error(401, "401 Unauthorized")
	}
	return s.store.GetDislikedPosts(ctx, username)
}

func (s *server) GetPostsByIdsRequest(ctx context.Context, in *helloworld.Ids) (*helloworld.GetAllPosts, error) {
	return s.store.GetPostsByIds(ctx, in)
}

func (s *server) GetStoriesByHashtagRequest(ctx context.Context, in *helloworld.Filter) (*helloworld.GetAllStories, error) {
	return s.store.GetStoriesByHashtag(ctx, in)
}

func (s *server) GetStoriesByTagRequest(ctx context.Context, in *helloworld.Filter) (*helloworld.GetAllStories, error) {
	return s.store.GetStoriesByTag(ctx, in)
}

func (s *server) GetStoriesByLocationRequest(ctx context.Context, in *helloworld.Filter) (*helloworld.GetAllStories, error) {
	return s.store.GetStoriesByLocation(ctx, in)
}

func (s *server) GetStoriesByIdsRequest(ctx context.Context, in *helloworld.Ids) (*helloworld.GetAllStories, error) {
	return s.store.GetStoriesByIds(ctx, in)
}

func (s *server) CommentRequest(ctx context.Context, in *helloworld.CreateCommentRequest) (*helloworld.Identifier, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &helloworld.Identifier{}, status.Error(401, "401 Unauthorized")
	}
	in.Comment.Username = username
	return s.store.CreateComment(ctx, in)
}

func (s *server) SavePostRequest(ctx context.Context, in *helloworld.SavePostReq) (*helloworld.Identifier, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &helloworld.Identifier{}, status.Error(401, "401 Unauthorized")
	}
	in.Post.Username = username
	return s.store.SavePost(ctx, in)
}

func (s *server) GetSavedPostsRequest(ctx context.Context, in *helloworld.SavedPostsRequest) (*helloworld.GetAllPosts, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &helloworld.GetAllPosts{}, status.Error(401, "401 Unauthorized")
	}
	in.Username = username
	savedPosts, _ := s.store.GetSavedPosts(ctx, in)

	ids := []int32{}
	for _, saved := range savedPosts {
		ids = append(ids, int32(saved.PostID))
	}

	return s.store.GetPostsByIds(ctx, &helloworld.Ids{Ids: ids})

}

func (s *server) GetCategoriesOfSavedPostsRequest(ctx context.Context, in *helloworld.Filter) (*helloworld.Categories, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &helloworld.Categories{}, status.Error(401, "401 Unauthorized")
	}
	in.Filter = username
	return s.store.GetCategoriesByUsername(ctx, in)
}

func (s *server) GetLocationsRequest(ctx context.Context, in *helloworld.EmptyRequest) (*helloworld.LocationsResponse, error) {
	return s.store.GetLocations(ctx, in)
}

func (s *server) StoryRequest(ctx context.Context, in *helloworld.CreateStoryRequest) (*helloworld.Identifier, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &helloworld.Identifier{}, status.Error(401, "401 Unauthorized")
	}
	in.Story.Username = username
	for _, tag := range in.Story.Tags {
		resp, err := http.Get("http://user_service:23002/canITag/" + tag)
		if err != nil {
			fmt.Println(err)
		}
		if resp.StatusCode != 200 {
			return &helloworld.Identifier{}, errors.New("ne mozete tagovati " + tag)
		}
		defer resp.Body.Close()
	}
	id, err := s.store.CreateStory(ctx, in)
	s.searchClient.StoryInfoRequest(ctx, &search.CreateStoryInfoRequest{
		StoryInfo: &search.StoryInfo{
			Username:  in.Story.Username,
			StoryId:   id.Id,
			CreatedAt: in.Story.CreatedAt,
		},
	})
	if err != nil {
		log.Error(err)
	}
	return id, err
}

func (s *server) GetStoryRequest(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.Story, error) {
	return s.store.GetStory(ctx, int(in.PostId))
}

func (s *server) GetAllStoriesRequest(ctx context.Context, in *helloworld.EmptyRequest) (*helloworld.GetAllStories, error) {
	return s.store.GetAllStories(ctx)
}

func (s *server) LikePostRequest(ctx context.Context, in *helloworld.ImpressionRequest) (*helloworld.EmptyRequest, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &helloworld.EmptyRequest{}, status.Error(401, "401 Unauthorized")
	}
	in.Request.Username = username
	return &helloworld.EmptyRequest{}, s.store.LikePost(ctx, in)
}

func (s *server) DislikePostRequest(ctx context.Context, in *helloworld.ImpressionRequest) (*helloworld.EmptyRequest, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &helloworld.EmptyRequest{}, status.Error(401, "401 Unauthorized")
	}
	in.Request.Username = username
	return &helloworld.EmptyRequest{}, s.store.DislikePost(ctx, in)
}

func (s *server) RemovePostLikeRequest(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.EmptyRequest, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &helloworld.EmptyRequest{}, status.Error(401, "401 Unauthorized")
	}
	in.Username = username
	return &helloworld.EmptyRequest{}, s.store.RemovePostLike(ctx, in)
}

func (s *server) RemovePostDislikeRequest(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.EmptyRequest, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &helloworld.EmptyRequest{}, status.Error(401, "401 Unauthorized")
	}
	in.Username = username
	return &helloworld.EmptyRequest{}, s.store.RemovePostDislike(ctx, in)
}

func (s *server) DeletePostRequest(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.EmptyRequest, error) {
	return &helloworld.EmptyRequest{}, s.store.DeletePost(ctx, int(in.PostId))
}

func (s *server) DeleteStoryRequest(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.EmptyRequest, error) {
	return &helloworld.EmptyRequest{}, s.store.DeleteStory(ctx, int(in.PostId))
}

func (s *server) SetHighlightRequest(ctx context.Context, in *helloworld.StoryHighlightRequest) (*helloworld.EmptyRequest, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &helloworld.EmptyRequest{}, status.Error(401, "401 Unauthorized")
	}
	story, _ := s.store.GetStory(ctx, int(in.Request.StoryId))
	if story.Username != username {
		return &helloworld.EmptyRequest{}, status.Error(401, "401 Unauthorized")
	}
	return &helloworld.EmptyRequest{}, s.store.SetStoryHighlight(ctx, in)
}

func (s *server) IsPostSavedRequest(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.BoolResponse, error) {
	return s.store.IsPostSaved(ctx, in)
}

func (s *server) RemoveSavedPostRequest(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.EmptyRequest, error) {
	s.store.RemoveSavedPost(ctx, in)
	return &helloworld.EmptyRequest{}, nil
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
	parts := strings.Fields(token)
	fmt.Println(parts[1])
	//req, _ := http.NewRequest("GET", "https://bezbednost:8443/auth/getUsernameByToken/"+parts[1], nil)
	resp, err := http.Get("http://bezbednost:8081/auth/getUsernameByToken/" + parts[1])
	if err != nil {
		fmt.Println(err)
		return ""
	}
	defer resp.Body.Close()
	b, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
	}
	log.Println(string(b))
	return string(b)
}
