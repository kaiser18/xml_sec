package searchstore

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	tracer "github.com/milossimic/grpc_rest/tracer"
	"github.com/nikolablesic/proto/search"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type SearchStore struct {
	db *gorm.DB
}

func New() (*SearchStore, error) {
	ts := &SearchStore{}

	host := os.Getenv("DBHOST")
	user := os.Getenv("USER")
	password := os.Getenv("PASSWORD")
	dbname := os.Getenv("DBNAME")
	dbport := os.Getenv("DBPORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", host, user, password, dbname, dbport)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	ts.db = db
	ts.db.AutoMigrate(&PostInfo{}, &StoryInfo{})

	return ts, nil
}

func (ts *SearchStore) CreatePostInfo(ctx context.Context, postInfo *search.CreatePostInfoRequest) (*search.Identifier, error) {
	span := tracer.StartSpanFromContext(ctx, "CreatePostInfo")
	defer span.Finish()

	post := PostInfo{
		ID:        int(postInfo.PostInfo.Id),
		Username:  postInfo.PostInfo.Username,
		PostID:    int(postInfo.PostInfo.PostId),
		CreatedAt: time.Now(),
	}

	ts.db.Create(&post)

	return &search.Identifier{
		Id: int32(post.ID),
	}, nil
}

func (ts *SearchStore) CreateStoryInfo(ctx context.Context, storyInfo *search.CreateStoryInfoRequest) (*search.Identifier, error) {
	span := tracer.StartSpanFromContext(ctx, "CreateStoryInfo")
	defer span.Finish()

	story := StoryInfo{
		ID:               int(storyInfo.StoryInfo.Id),
		Username:         storyInfo.StoryInfo.Username,
		PostID:           int(storyInfo.StoryInfo.StoryId),
		CreatedAt:        time.Now(),
		OnlyCloseFriends: storyInfo.StoryInfo.OnlyCloseFriends,
		IsHighlight:      storyInfo.StoryInfo.IsHighlight,
	}

	ts.db.Create(&story)

	return &search.Identifier{
		Id: int32(story.ID),
	}, nil
}

func (ts *SearchStore) GetStoriesByUsername(ctx context.Context, username *search.ActionRequest) ([]StoryInfo, error) {
	span := tracer.StartSpanFromContext(ctx, "GetStoriesByUsername")
	defer span.Finish()

	var stories []StoryInfo
	ts.db.Where("username = ?", username.Filter).Find(&stories)

	return stories, nil
}

func (ts *SearchStore) GetStoriesByUsernames(ctx context.Context, usernames []string) ([]StoryInfo, error) {
	span := tracer.StartSpanFromContext(ctx, "GetStoriesByUsernames")
	defer span.Finish()
	var stories []StoryInfo
	ts.db.Where("username IN " + MakeRange(usernames) + " ").Find(&stories)
	return stories, nil
}

func (ts *SearchStore) GetPostsByUsername(ctx context.Context, username *search.ActionRequest) ([]PostInfo, error) {
	span := tracer.StartSpanFromContext(ctx, "GetPostsByUsername")
	defer span.Finish()

	var posts []PostInfo
	ts.db.Where("username = ?", username.Filter).Find(&posts)

	return posts, nil
}

func (ts *SearchStore) GetPostsByUsernames(ctx context.Context, usernames []string) ([]PostInfo, error) {
	span := tracer.StartSpanFromContext(ctx, "GetPostsByUsernames")
	defer span.Finish()
	var posts []PostInfo
	ts.db.Where("username IN " + MakeRange(usernames) + " ").Find(&posts)
	return posts, nil
}

func MakeRange(usernames []string) string {
	var sb strings.Builder
	sb.WriteString("(")
	for _, username := range usernames {
		sb.WriteString(username)
		sb.WriteString(", ")
	}
	s := sb.String()
	if last := len(s) - 2; last >= 0 {
		s = s[:last]
	}
	return s + ")"
}

func (ts *SearchStore) Close() error {
	db, err := ts.db.DB()
	if err != nil {
		return err
	}

	db.Close()
	return nil
}
