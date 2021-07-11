package poststore

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/nikolablesic/proto/helloworld"

	tracer "github.com/milossimic/grpc_rest/tracer"
	log "github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type PostStore struct {
	db *gorm.DB
}

func New() (*PostStore, error) {
	ts := &PostStore{}

	host := os.Getenv("DBHOST")
	user := os.Getenv("USER")
	password := os.Getenv("PASSWORD")
	dbname := os.Getenv("DBNAME")
	dbport := os.Getenv("DBPORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", host, user, password, dbname, dbport)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Error(err)
		return nil, err
	}
	ts.db = db
	ts.db.AutoMigrate(&Post{}, &Hashtag{}, &Location{}, &Comment{}, &ImagePath{}, &Username{}, &Story{}, &SavedPost{})
	return ts, nil
}

func (ts *PostStore) CreatePost(ctx context.Context, postRequest *helloworld.CreatePostRequest) (*helloworld.Identifier, error) {
	span := tracer.StartSpanFromContext(ctx, "CreatePost")
	defer span.Finish()

	location, err := ts.CreateLocationIfNotExists(postRequest.Post.LocationName)
	if err != nil {
		log.Error(err)
		ts.db.Rollback()
		return &helloworld.Identifier{
			Id: int32(-1),
		}, err
	}

	post := Post{
		Username:    postRequest.Post.Username,
		LocationID:  location.ID,
		Description: postRequest.Post.Description,
		CreatedAt:   time.Now(),
	}

	newHashtags := []Hashtag{}
	for _, hashtag := range postRequest.Post.Hashtags {
		h, err := ts.CreateHashtagIfNotExists(hashtag)
		if err != nil {
			log.Error(err)
			ts.db.Rollback()
			return &helloworld.Identifier{
				Id: int32(-1),
			}, err
		}
		newHashtags = append(newHashtags, Hashtag{ID: h.ID, Name: hashtag})
	}
	post.Hashtags = newHashtags

	newTags := []Username{}
	for _, tag := range postRequest.Post.Tags {
		t, err := ts.CreateHashtagIfNotExists(tag)
		if err != nil {
			log.Error(err)
			ts.db.Rollback()
			return &helloworld.Identifier{
				Id: int32(-1),
			}, err
		}
		newTags = append(newTags, Username{ID: t.ID, Name: tag})
	}
	post.Tags = newTags

	newUrls := []ImagePath{}
	for _, path := range postRequest.Post.ImageUrls {
		newUrls = append(newUrls, ImagePath{Path: path})
	}
	post.ImageUrls = newUrls

	ts.db.Create(&post)

	return &helloworld.Identifier{
		Id: int32(post.ID),
	}, nil
}

func (ts *PostStore) CreateStory(ctx context.Context, storyRequest *helloworld.CreateStoryRequest) (*helloworld.Identifier, error) {
	span := tracer.StartSpanFromContext(ctx, "CreatePost")
	defer span.Finish()

	location, err := ts.CreateLocationIfNotExists(storyRequest.Story.LocationName)
	if err != nil {
		log.Error(err)
		ts.db.Rollback()
		return &helloworld.Identifier{
			Id: int32(-1),
		}, err
	}

	story := Story{
		Username:         storyRequest.Story.Username,
		LocationID:       location.ID,
		Description:      storyRequest.Story.Description,
		CreatedAt:        time.Now(),
		OnlyCloseFriends: storyRequest.Story.OnlyCloseFriends,
		IsHighlight:      storyRequest.Story.IsHighlight,
	}

	newHashtags := []Hashtag{}
	for _, hashtag := range storyRequest.Story.Hashtags {
		h, err := ts.CreateHashtagIfNotExists(hashtag)
		if err != nil {
			log.Error(err)
			ts.db.Rollback()
			return &helloworld.Identifier{
				Id: int32(-1),
			}, err
		}
		newHashtags = append(newHashtags, Hashtag{ID: h.ID, Name: hashtag})
	}
	story.Hashtags = newHashtags

	newTags := []Username{}
	for _, tag := range storyRequest.Story.Tags {
		t, err := ts.CreateHashtagIfNotExists(tag)
		if err != nil {
			log.Error(err)
			ts.db.Rollback()
			return &helloworld.Identifier{
				Id: int32(-1),
			}, err
		}
		newTags = append(newTags, Username{ID: t.ID, Name: tag})
	}
	story.Tags = newTags

	newUrls := []ImagePath{}
	for _, path := range storyRequest.Story.ImageUrls {
		newUrls = append(newUrls, ImagePath{Path: path})
	}
	story.ImageUrls = newUrls

	ts.db.Create(&story)

	return &helloworld.Identifier{
		Id: int32(story.ID),
	}, nil
}

func (ts *PostStore) CreateComment(ctx context.Context, commentRequest *helloworld.CreateCommentRequest) (*helloworld.Identifier, error) {
	span := tracer.StartSpanFromContext(ctx, "CreatePost")
	defer span.Finish()

	comment := Comment{
		Content:   commentRequest.Comment.Content,
		Username:  commentRequest.Comment.Username,
		OwnerID:   int(commentRequest.Comment.PostId),
		OwnerType: "posts",
	}

	ts.db.Create(&comment)

	return &helloworld.Identifier{
		Id: int32(comment.ID),
	}, nil
}

func (ts *PostStore) SavePost(ctx context.Context, request *helloworld.SavePostReq) (*helloworld.Identifier, error) {
	span := tracer.StartSpanFromContext(ctx, "SavePost")
	defer span.Finish()

	var usern Username
	res := ts.db.FirstOrCreate(&usern, Username{Name: request.Post.Username})
	if res.Error != nil {
		log.Error(res.Error)
		return &helloworld.Identifier{}, res.Error
	}

	var cat SavedPostCategory
	res = ts.db.FirstOrCreate(&cat, SavedPostCategory{Username: request.Post.Username, CategoryName: request.Post.CategoryName})
	if res.Error != nil {
		log.Error(res.Error)
		return &helloworld.Identifier{}, res.Error
	}

	savedPost := SavedPost{
		Username:   request.Post.Username,
		CategoryID: cat.ID,
		PostID:     int(request.Post.PostId),
	}

	ts.db.Create(&savedPost)

	return &helloworld.Identifier{
		Id: int32(savedPost.ID),
	}, nil
}

func (ts *PostStore) RemoveSavedPost(ctx context.Context, in *helloworld.ActionRequest) error {
	span := tracer.StartSpanFromContext(ctx, "RemoveSavedPost")
	defer span.Finish()

	var usern Username
	res := ts.db.FirstOrCreate(&usern, Username{Name: in.Username})
	if res.Error != nil {
		log.Error(res.Error)
		return res.Error
	}
	ts.db.Exec("DELETE FROM saved_posts WHERE post_id = ? AND username = ?", in.PostId, in.Username)
	return nil
}

func (ts *PostStore) IsPostSaved(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.BoolResponse, error) {
	span := tracer.StartSpanFromContext(ctx, "IsPostSaved")
	defer span.Finish()

	var saved []SavedPost
	ts.db.Where("post_id = ? AND username = ?", in.PostId, in.Username).Find(&saved)
	if len(saved) > 0 {
		return &helloworld.BoolResponse{
			Response: true,
		}, nil
	}
	return &helloworld.BoolResponse{
		Response: false,
	}, nil
}

func (ts *PostStore) GetSavedPosts(ctx context.Context, request *helloworld.SavedPostsRequest) ([]SavedPost, error) {
	span := tracer.StartSpanFromContext(ctx, "GetSavedPosts")
	defer span.Finish()

	var saved []SavedPost
	ts.db.Where("SavedPosts.id in (SELECT s.id FROM savedPosts s, savedPostCategory c WHERE c.id = s.category_id AND username = ? AND c.categoryName = ?)", request.Username, request.CategoryName).Preload("SavedPostCategories").Find(&saved)
	ts.db.Find(&saved)
	return saved, nil
}

func (ts *PostStore) GetCategoriesByUsername(ctx context.Context, request *helloworld.Filter) (*helloworld.Categories, error) {
	span := tracer.StartSpanFromContext(ctx, "GetCategoriesByUsername")
	defer span.Finish()

	var categories []SavedPostCategory
	ts.db.Where("username = ?", request.Filter).Find(&categories)

	ret := []string{}
	for _, cat := range categories {
		ret = append(ret, cat.CategoryName)
	}

	return &helloworld.Categories{
		Categories: ret,
	}, nil
}

func (ts *PostStore) GetLocations(ctx context.Context, request *helloworld.EmptyRequest) (*helloworld.LocationsResponse, error) {
	span := tracer.StartSpanFromContext(ctx, "GetLocations")
	defer span.Finish()

	var locations []Location
	ts.db.Find(&locations)

	ret := []*helloworld.Location{}
	for _, location := range locations {
		ret = append(ret, &helloworld.Location{
			Id:   int32(location.ID),
			Name: location.Name,
		})
	}

	return &helloworld.LocationsResponse{
		Locations: ret,
	}, nil
}

func (ts *PostStore) LikePost(ctx context.Context, likeRequest *helloworld.ImpressionRequest) error {
	span := tracer.StartSpanFromContext(ctx, "LikePost")
	defer span.Finish()

	var usern Username
	res := ts.db.FirstOrCreate(&usern, Username{Name: likeRequest.Request.Username})
	if res.Error != nil {
		log.Error(res.Error)
		return res.Error
	}
	ts.db.Exec("INSERT into post_like (post_id, username_id) VALUES (?,?)", likeRequest.Request.PostId, usern.ID)
	return nil
}

func (ts *PostStore) DislikePost(ctx context.Context, dislikeRequest *helloworld.ImpressionRequest) error {
	span := tracer.StartSpanFromContext(ctx, "DislikePost")
	defer span.Finish()

	var usern Username
	res := ts.db.FirstOrCreate(&usern, Username{Name: dislikeRequest.Request.Username})
	if res.Error != nil {
		log.Error(res.Error)
		return res.Error
	}
	ts.db.Exec("INSERT into post_dislike (post_id, username_id) VALUES (?,?)", dislikeRequest.Request.PostId, usern.ID)
	return nil
}

func (ts *PostStore) RemovePostLike(ctx context.Context, likeRequest *helloworld.ActionRequest) error {
	span := tracer.StartSpanFromContext(ctx, "RemovePostLike")
	defer span.Finish()

	var usern Username
	res := ts.db.FirstOrCreate(&usern, Username{Name: likeRequest.Username})
	if res.Error != nil {
		log.Error(res.Error)
		return res.Error
	}
	ts.db.Exec("DELETE FROM post_like WHERE post_id = ? AND username_id = ?", likeRequest.PostId, usern.ID)
	return nil
}

func (ts *PostStore) RemovePostDislike(ctx context.Context, dislikeRequest *helloworld.ActionRequest) error {
	span := tracer.StartSpanFromContext(ctx, "RemovePostDislike")
	defer span.Finish()

	var usern Username
	res := ts.db.FirstOrCreate(&usern, Username{Name: dislikeRequest.Username})
	if res.Error != nil {
		log.Error(res.Error)
		return res.Error
	}
	ts.db.Exec("DELETE FROM post_dislike WHERE post_id = ? AND username_id = ?", dislikeRequest.PostId, usern.ID)
	return nil
}

func (ts *PostStore) CreateLocationIfNotExists(locationName string) (*Location, error) {
	var location Location
	res := ts.db.FirstOrCreate(&location, Location{Name: locationName})
	if res.Error != nil {
		log.Error(res.Error)
		return nil, res.Error
	}
	return &location, nil
}

func (ts *PostStore) CreateHashtagIfNotExists(tagName string) (*Hashtag, error) {
	var tag Hashtag
	res := ts.db.FirstOrCreate(&tag, Hashtag{Name: tagName})
	if res.Error != nil {
		log.Error(res.Error)
		return nil, res.Error
	}
	return &tag, nil
}

func (ts *PostStore) CreateUsernameIfNotExists(username string) (*Username, error) {
	var usern Username
	res := ts.db.FirstOrCreate(&usern, Username{Name: username})
	if res.Error != nil {
		log.Error(res.Error)
		return nil, res.Error
	}
	return &usern, nil
}

func (ts *PostStore) PublicationExists(id int, pType string) bool {
	if pType == "POST" {
		var post Post
		result := ts.db.Find(&post, id)
		if result.RowsAffected > 0 {
			return true
		}
	} else {
		var story Story
		result := ts.db.Find(&story, id)
		if result.RowsAffected > 0 {
			return true
		}
	}

	return false
}

func (ts *PostStore) GetPost(ctx context.Context, id int) (*helloworld.Post, error) {
	span := tracer.StartSpanFromContext(ctx, "GetPost")
	defer span.Finish()

	var post Post
	result := ts.db.Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Preload("Comments").Preload("Likes").Preload("Dislikes").Find(&post, id)

	if result.RowsAffected > 0 {
		return postPostgresToProto(post), nil
	}

	return &helloworld.Post{}, fmt.Errorf("post with id=%d not found", id)
}

func (ts *PostStore) GetStory(ctx context.Context, id int) (*helloworld.Story, error) {
	span := tracer.StartSpanFromContext(ctx, "GetStory")
	defer span.Finish()

	var story Story
	result := ts.db.Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Find(&story, id)

	if result.RowsAffected > 0 {
		return storyPostgresToProto(story), nil
	}

	return &helloworld.Story{}, fmt.Errorf("story with id=%d not found", id)
}

func (ts *PostStore) DeletePost(ctx context.Context, id int) error {
	span := tracer.StartSpanFromContext(ctx, "DeletePost")
	defer span.Finish()

	ts.db.Exec("DELETE FROM post_dislike WHERE post_id = ?", id)
	ts.db.Exec("DELETE FROM post_like WHERE post_id = ?", id)
	ts.db.Exec("DELETE FROM post_hashtag WHERE post_id = ?", id)
	ts.db.Exec("DELETE FROM post_tag WHERE post_id = ?", id)
	ts.db.Exec("DELETE FROM post_image WHERE post_id = ?", id)
	result := ts.db.Delete(&Post{}, id)
	if result.RowsAffected > 0 {
		return nil
	}

	return fmt.Errorf("post with id=%d not found", id)
}

func (ts *PostStore) DeleteStory(ctx context.Context, id int) error {
	span := tracer.StartSpanFromContext(ctx, "DeleteStory")
	defer span.Finish()

	ts.db.Exec("DELETE FROM story_hashtag WHERE story_id = ?", id)
	ts.db.Exec("DELETE FROM story_tag WHERE story_id = ?", id)
	ts.db.Exec("DELETE FROM story_image WHERE story_id = ?", id)
	result := ts.db.Delete(&Story{}, id)
	if result.RowsAffected > 0 {
		return nil
	}

	return fmt.Errorf("story with id=%d not found", id)
}

func (ts *PostStore) GetAllPosts(ctx context.Context) (*helloworld.GetAllPosts, error) {
	span := tracer.StartSpanFromContext(ctx, "GetAllPosts")
	defer span.Finish()

	var posts []Post
	ts.db.Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Preload("Comments").Preload("Likes").Preload("Dislikes").Find(&posts)

	return &helloworld.GetAllPosts{
		Posts: postsPostgresToProto(posts),
	}, nil
}

func (ts *PostStore) GetPostsByHashtag(ctx context.Context, filter *helloworld.Filter) (*helloworld.GetAllPosts, error) {
	span := tracer.StartSpanFromContext(ctx, "GetPostsByHashtag")
	defer span.Finish()

	var posts []Post
	ts.db.Where(`Posts.id in (SELECT p.id FROM posts p, post_hashtag ph, hashtags h WHERE p.id = ph.post_id AND ph.hashtag_id = h.id AND h.name = ?)`, filter.Filter).Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Preload("Comments").Preload("Likes").Preload("Dislikes").Find(&posts)
	return &helloworld.GetAllPosts{
		Posts: postsPostgresToProto(posts),
	}, nil
}

func (ts *PostStore) GetPostsByTag(ctx context.Context, filter *helloworld.Filter) (*helloworld.GetAllPosts, error) {
	span := tracer.StartSpanFromContext(ctx, "GetPostsByTag")
	defer span.Finish()

	var posts []Post
	ts.db.Where(`Posts.id in (SELECT p.id FROM posts p, post_tag pt, usernames u WHERE p.id = pt.post_id AND pt.username_id = u.id AND u.name = ?)`, filter.Filter).Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Preload("Comments").Preload("Likes").Preload("Dislikes").Find(&posts)

	return &helloworld.GetAllPosts{
		Posts: postsPostgresToProto(posts),
	}, nil
}

func (ts *PostStore) GetPostsByLocation(ctx context.Context, filter *helloworld.Filter) (*helloworld.GetAllPosts, error) {
	span := tracer.StartSpanFromContext(ctx, "GetPostsByLocation")
	defer span.Finish()

	var posts []Post
	ts.db.Where(`Posts.id in (SELECT p.id FROM posts p, locations l WHERE p.location_id = l.id AND l.name = ?)`, filter.Filter).Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Preload("Comments").Preload("Likes").Preload("Dislikes").Find(&posts)

	return &helloworld.GetAllPosts{
		Posts: postsPostgresToProto(posts),
	}, nil
}

func (ts *PostStore) GetLikedPosts(ctx context.Context, username string) (*helloworld.GetAllPosts, error) {
	span := tracer.StartSpanFromContext(ctx, "GetLikedPosts")
	defer span.Finish()

	var posts []Post
	ts.db.Where(`Posts.id in (select p.id from posts p, post_like pl, usernames u where p.id = pl.post_id and pl.username_id = u.id and u.name = ?)`, username).Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Preload("Comments").Preload("Likes").Preload("Dislikes").Find(&posts)
	return &helloworld.GetAllPosts{
		Posts: postsPostgresToProto(posts),
	}, nil
}

func (ts *PostStore) GetDislikedPosts(ctx context.Context, username string) (*helloworld.GetAllPosts, error) {
	span := tracer.StartSpanFromContext(ctx, "GetDislikedPosts")
	defer span.Finish()

	var posts []Post
	ts.db.Where(`Posts.id in (select p.id from posts p, post_dislike pd, usernames u where p.id = pd.post_id and pd.username_id = u.id and u.name = ?)`, username).Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Preload("Comments").Preload("Likes").Preload("Dislikes").Find(&posts)
	return &helloworld.GetAllPosts{
		Posts: postsPostgresToProto(posts),
	}, nil
}

func (ts *PostStore) GetPostsByIds(ctx context.Context, ids *helloworld.Ids) (*helloworld.GetAllPosts, error) {
	span := tracer.StartSpanFromContext(ctx, "GetPostsByIds")
	defer span.Finish()

	var posts []Post
	ts.db.Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Preload("Comments").Preload("Likes").Preload("Dislikes").Where("Posts.id IN " + MakeRange(ids.Ids) + " ").Order("Posts.Created_At desc").Find(&posts)

	return &helloworld.GetAllPosts{
		Posts: postsPostgresToProto(posts),
	}, nil
}

func (ts *PostStore) GetStoriesByHashtag(ctx context.Context, filter *helloworld.Filter) (*helloworld.GetAllStories, error) {
	span := tracer.StartSpanFromContext(ctx, "GetStoriesByHashtag")
	defer span.Finish()

	var stories []Story
	ts.db.Where(`Stories.id in (SELECT s.id FROM stories s, story_hashtag sh, hashtags h WHERE s.id = sh.story_id AND sh.hashtag_id = h.id AND h.name = ?)`, filter.Filter).Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Find(&stories)
	return &helloworld.GetAllStories{
		Stories: storiesPostgresToProto(stories),
	}, nil
}

func (ts *PostStore) GetStoriesByTag(ctx context.Context, filter *helloworld.Filter) (*helloworld.GetAllStories, error) {
	span := tracer.StartSpanFromContext(ctx, "GetStoriesByTag")
	defer span.Finish()

	var stories []Story
	ts.db.Where(`Stories.id in (SELECT s.id FROM stories s, story_tag st, usernames u WHERE s.id = st.story_id AND st.username_id = u.id AND u.name = ?)`, filter.Filter).Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Find(&stories)

	return &helloworld.GetAllStories{
		Stories: storiesPostgresToProto(stories),
	}, nil
}

func (ts *PostStore) GetStoriesByLocation(ctx context.Context, filter *helloworld.Filter) (*helloworld.GetAllStories, error) {
	span := tracer.StartSpanFromContext(ctx, "GetStoriesByLocation")
	defer span.Finish()

	var stories []Story
	ts.db.Where(`Stories.id in (SELECT s.id FROM stories s, locations l WHERE s.location_id = l.id AND l.name = ?)`, filter.Filter).Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Find(&stories)

	return &helloworld.GetAllStories{
		Stories: storiesPostgresToProto(stories),
	}, nil
}

func (ts *PostStore) GetStoriesByIds(ctx context.Context, ids *helloworld.Ids) (*helloworld.GetAllStories, error) {
	span := tracer.StartSpanFromContext(ctx, "GetStoriesByIds")
	defer span.Finish()

	var stories []Story
	ts.db.Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Where("Stories.id IN " + MakeRange(ids.Ids) + " ").Order("Stories.Created_At desc").Find(&stories)

	now := time.Now()
	var ret []Story
	for _, story := range stories {
		exp := story.CreatedAt.Add(24 * time.Hour)
		if story.Username == ids.Username {
			ret = append(ret, story)
		} else if now.Before(exp) {
			ret = append(ret, story)
		}
	}

	return &helloworld.GetAllStories{
		Stories: storiesPostgresToProto(ret),
	}, nil
}

func MakeRange(ids []int32) string {
	var sb strings.Builder
	sb.WriteString("(")
	for _, id := range ids {
		sb.WriteString("'")
		sb.WriteString(fmt.Sprint(id))
		sb.WriteString("'")
		sb.WriteString(", ")
	}
	s := sb.String()
	if last := len(s) - 2; last >= 0 {
		s = s[:last]
	}
	return s + ")"
}

func storiesPostgresToProto(stories []Story) []*helloworld.Story {
	ret := []*helloworld.Story{}
	for _, story := range stories {
		ret = append(ret, storyPostgresToProto(story))
	}
	return ret
}

func storyPostgresToProto(story Story) *helloworld.Story {
	return &helloworld.Story{
		Id:               int32(story.ID),
		Username:         story.Username,
		LocationName:     story.Location.Name,
		Description:      story.Description,
		CreatedAt:        story.CreatedAt.String(),
		Hashtags:         hashtagsPostgresToProto(story.Hashtags),
		Tags:             usernamesPostgresToProto(story.Tags),
		ImageUrls:        imageUrlsPostgresToProto(story.ImageUrls),
		OnlyCloseFriends: story.OnlyCloseFriends,
		IsHighlight:      story.IsHighlight,
	}
}

func postsPostgresToProto(posts []Post) []*helloworld.Post {
	ret := []*helloworld.Post{}
	for _, post := range posts {
		ret = append(ret, postPostgresToProto(post))
	}
	return ret
}

func postPostgresToProto(post Post) *helloworld.Post {
	return &helloworld.Post{
		Id:           int32(post.ID),
		Username:     post.Username,
		LocationName: post.Location.Name,
		Description:  post.Description,
		CreatedAt:    post.CreatedAt.String(),
		Hashtags:     hashtagsPostgresToProto(post.Hashtags),
		Tags:         usernamesPostgresToProto(post.Tags),
		ImageUrls:    imageUrlsPostgresToProto(post.ImageUrls),
		Likes:        usernamesPostgresToProto(post.Likes),
		Dislikes:     usernamesPostgresToProto(post.Dislikes),
		Comments:     commentsPostgresToProto(post.Comments),
	}
}

func imageUrlsPostgresToProto(urls []ImagePath) []string {
	ret := []string{}
	for _, url := range urls {
		ret = append(ret, url.Path)
	}
	return ret
}

func usernamesPostgresToProto(usernames []Username) []string {
	ret := []string{}
	for _, username := range usernames {
		ret = append(ret, username.Name)
	}
	return ret
}

func hashtagsPostgresToProto(hashtags []Hashtag) []string {
	ret := []string{}
	for _, hashtag := range hashtags {
		ret = append(ret, hashtag.Name)
	}
	return ret
}

func commentsPostgresToProto(comments []Comment) []*helloworld.Comment {
	ret := []*helloworld.Comment{}
	for _, comment := range comments {
		ret = append(ret, commentPostgresToProto(comment))
	}
	return ret
}

func commentPostgresToProto(comment Comment) *helloworld.Comment {
	return &helloworld.Comment{
		Id:       int32(comment.ID),
		Content:  comment.Content,
		Username: comment.Username,
		PostId:   int32(comment.OwnerID),
	}
}

func (ts *PostStore) GetAllStories(ctx context.Context) (*helloworld.GetAllStories, error) {
	span := tracer.StartSpanFromContext(ctx, "GetAllStories")
	defer span.Finish()

	var stories []Story
	ts.db.Preload("Tags").Preload("Hashtags").Preload("Location").Preload("ImageUrls").Find(&stories)

	return &helloworld.GetAllStories{
		Stories: storiesPostgresToProto(stories),
	}, nil
}

func (ts *PostStore) SetStoryHighlight(ctx context.Context, highlightRequest *helloworld.StoryHighlightRequest) error {
	span := tracer.StartSpanFromContext(ctx, "SetStoryHighlight")
	defer span.Finish()

	var story Story
	result := ts.db.Find(&story, highlightRequest.Request.StoryId)

	if result.RowsAffected <= 0 {
		return fmt.Errorf("story with id=%d not found", highlightRequest.Request.StoryId)
	}

	ts.db.Model(&story).Update("is_highlight", highlightRequest.Request.IsHighlight)
	return nil
}

func (ts *PostStore) Close() error {
	db, err := ts.db.DB()
	if err != nil {
		log.Error(err)
		return err
	}

	db.Close()
	return nil
}
