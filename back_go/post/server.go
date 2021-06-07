package main

import (
	"context"
	"io"
	"net/http"
	"post/poststore"

	"github.com/nikolablesic/proto/helloworld"
	"github.com/nikolablesic/proto/search"

	tracer "github.com/milossimic/grpc_rest/tracer"
	otgo "github.com/opentracing/opentracing-go"
	"github.com/opentracing/opentracing-go/ext"
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
	})
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
	return s.tracer
}

func (s *server) GetCloser() io.Closer {
	return s.closer
}

func (s *server) PostRequest(ctx context.Context, in *helloworld.CreatePostRequest) (*helloworld.Identifier, error) {
	id, err := s.store.CreatePost(ctx, in)
	s.searchClient.PostInfoRequest(ctx, &search.CreatePostInfoRequest{
		PostInfo: &search.PostInfo{
			Username:  in.Post.Username,
			PostId:    id.Id,
			CreatedAt: in.Post.CreatedAt,
		},
	})
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
	return s.store.CreateComment(ctx, in)
}

func (s *server) SavePostRequest(ctx context.Context, in *helloworld.SavePostReq) (*helloworld.Identifier, error) {
	return s.store.SavePost(ctx, in)
}

func (s *server) GetSavedPostsRequest(ctx context.Context, in *helloworld.SavedPostsRequest) (*helloworld.GetAllPosts, error) {
	savedPosts, _ := s.store.GetSavedPosts(ctx, in)

	ids := []int32{}
	for _, saved := range savedPosts {
		ids = append(ids, int32(saved.PostID))
	}

	return s.store.GetPostsByIds(ctx, &helloworld.Ids{Ids: ids})

}

func (s *server) GetCategoriesOfSavedPostsRequest(ctx context.Context, in *helloworld.Filter) (*helloworld.Categories, error) {
	return s.store.GetCategoriesByUsername(ctx, in)
}

func (s *server) GetLocationsRequest(ctx context.Context, in *helloworld.EmptyRequest) (*helloworld.LocationsResponse, error) {
	return s.store.GetLocations(ctx, in)
}

func (s *server) StoryRequest(ctx context.Context, in *helloworld.CreateStoryRequest) (*helloworld.Identifier, error) {
	id, err := s.store.CreateStory(ctx, in)
	s.searchClient.StoryInfoRequest(ctx, &search.CreateStoryInfoRequest{
		StoryInfo: &search.StoryInfo{
			Username:  in.Story.Username,
			StoryId:   id.Id,
			CreatedAt: in.Story.CreatedAt,
		},
	})
	return id, err
}

func (s *server) GetStoryRequest(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.Story, error) {
	return s.store.GetStory(ctx, int(in.PostId))
}

func (s *server) GetAllStoriesRequest(ctx context.Context, in *helloworld.EmptyRequest) (*helloworld.GetAllStories, error) {
	return s.store.GetAllStories(ctx)
}

func (s *server) LikePostRequest(ctx context.Context, in *helloworld.ImpressionRequest) (*helloworld.EmptyRequest, error) {
	return &helloworld.EmptyRequest{}, s.store.LikePost(ctx, in)
}

func (s *server) DislikePostRequest(ctx context.Context, in *helloworld.ImpressionRequest) (*helloworld.EmptyRequest, error) {
	return &helloworld.EmptyRequest{}, s.store.DislikePost(ctx, in)
}

func (s *server) RemovePostLikeRequest(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.EmptyRequest, error) {
	return &helloworld.EmptyRequest{}, s.store.RemovePostLike(ctx, in)
}

func (s *server) RemovePostDislikeRequest(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.EmptyRequest, error) {
	return &helloworld.EmptyRequest{}, s.store.RemovePostDislike(ctx, in)
}

func (s *server) DeletePostRequest(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.EmptyRequest, error) {
	return &helloworld.EmptyRequest{}, s.store.DeletePost(ctx, int(in.PostId))
}

func (s *server) DeleteStoryRequest(ctx context.Context, in *helloworld.ActionRequest) (*helloworld.EmptyRequest, error) {
	return &helloworld.EmptyRequest{}, s.store.DeleteStory(ctx, int(in.PostId))
}

func (s *server) SetHighlightRequest(ctx context.Context, in *helloworld.StoryHighlightRequest) (*helloworld.EmptyRequest, error) {
	return &helloworld.EmptyRequest{}, s.store.SetStoryHighlight(ctx, in)
}