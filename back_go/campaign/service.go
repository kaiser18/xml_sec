package main

import (
	"campaign/campaignstore"
	store "campaign/campaignstore"
	"errors"
	"fmt"
	"io/ioutil"
	"strings"

	"google.golang.org/grpc/metadata"

	"context"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/nikolablesic/proto/campaign"
	"github.com/nikolablesic/proto/helloworld"

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
				ext.RPCServerOption(parentSpanContext),
				grpcGatewayTag,
			)
			r = r.WithContext(otgo.ContextWithSpan(r.Context(), serverSpan))
			defer serverSpan.Finish()
		}
		h.ServeHTTP(w, r)
	})
}

const name = "campaign_service"

type server struct {
	campaign.UnimplementedCampaignServiceServer
	postClient helloworld.GreeterClient
	store      *campaignstore.CampaignStore
	tracer     otgo.Tracer
	closer     io.Closer
}

func NewServer(postClient helloworld.GreeterClient) (*server, error) {
	store, err := campaignstore.New()
	if err != nil {
		log.Println(err)
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
	log.Println(s.tracer)
	return s.tracer
}

func (s *server) GetCloser() io.Closer {
	log.Println(s.closer)
	return s.closer
}

func (s *server) CampaignRequest(ctx context.Context, in *campaign.CreateCampaignRequest) (*campaign.Identifier, error) {
	followList := GetFollowList(in.Campaign.Username)
	for _, influenser := range in.Campaign.Influensers {
		if !contains(followList, influenser) {
			return &campaign.Identifier{}, errors.New("please follow " + influenser)
		}
	}
	cmp := makeCampaignFromProto(in.Campaign)
	cmp.TargetAudience = GetTargetAudience(int(in.Campaign.TargetAgeFrom), int(in.Campaign.TargetAgeTo))
	id, err := s.store.CreateCampaign(ctx, cmp)
	if err != nil {
		return &campaign.Identifier{}, err
	}
	return &campaign.Identifier{Id: int32(id)}, nil
}

func (s *server) GetCampaignRequest(ctx context.Context, in *campaign.Identifier) (*campaign.Campaign, error) {
	cmp, err := s.store.GetCampaign(ctx, int(in.Id))
	if err != nil {
		return &campaign.Campaign{}, err
	}
	return makeCampaignProto(cmp), nil
}

func (s *server) AdvertisementRequest(ctx context.Context, in *campaign.CreateAdvertisementRequest) (*campaign.Identifier, error) {
	adv := makeAdvertisementFromProto(in.Advertisement)
	id, err := s.store.CreateAdvertisement(ctx, adv)
	if err != nil {
		return &campaign.Identifier{}, err
	}
	return &campaign.Identifier{Id: int32(id)}, nil
}

func (s *server) GetAdvertisementRequest(ctx context.Context, in *campaign.Identifier) (*campaign.AdvertisementResponse, error) {
	adv, err := s.store.GetAdvertisement(ctx, int(in.Id))
	if err != nil {
		return &campaign.AdvertisementResponse{}, err
	}
	return s.makeAdvertisementResponseProto(ctx, adv, false, ""), nil
}

func (s *server) GetAdvertisementsByCampaignRequest(ctx context.Context, in *campaign.Identifier) (*campaign.Advertisements, error) {
	ads, err := s.store.GetAdvertisementsByCampaign(ctx, int(in.Id))
	if err != nil {
		return &campaign.Advertisements{}, err
	}
	return s.makeAdvertisementsProto(ctx, ads), nil
}

func (s *server) GetAdvertisementsForUserRequest(ctx context.Context, in *campaign.ActionRequest) (*campaign.Advertisements, error) {
	ads, err := s.store.GetAdvertisementsByUser(ctx, in.Username, int(in.PostType))
	if err != nil {
		return &campaign.Advertisements{}, err
	}
	infAds := s.GetInfluensersAds(ctx, in.Username, int(in.PostType))
	cAds := s.makeAdvertisementsProto(ctx, ads)
	newList := append(cAds.Advertisements, infAds.Advertisements...)
	ids := []int{}
	for _, item := range newList {
		ids = append(ids, int(item.Id))
	}
	new := unique(ids)
	s.store.SaveViews(new, in.Username)
	return &campaign.Advertisements{
		Advertisements: newList,
	}, nil
}

func makeCampaignProto(cmp *store.Campaign) *campaign.Campaign {
	return &campaign.Campaign{
		Id:          int32(cmp.ID),
		Username:    cmp.Username,
		CreatedAt:   cmp.CreatedAt.String(),
		Start:       cmp.Start.String(),
		End:         cmp.End.String(),
		ShowNumber:  int32(cmp.ShowNumber),
		Influensers: makeStringFromUsernames(cmp.Influensers),
		EditFor:     int32(cmp.EditFor),
	}
}

func (s *server) makeAdvertisementsProto(ctx context.Context, ads []store.Advertisement) *campaign.Advertisements {
	list := []*campaign.AdvertisementResponse{}
	for _, ad := range ads {
		list = append(list, s.makeAdvertisementResponseProto(ctx, &ad, false, ""))
	}
	return &campaign.Advertisements{
		Advertisements: list,
	}
}

func (s *server) makeAdvertisementResponseProto(ctx context.Context, adv *store.Advertisement, isInfluenser bool, influenser string) *campaign.AdvertisementResponse {
	if adv.PublicationType == 0 {
		post, _ := s.postClient.GetPostRequest(ctx, &helloworld.ActionRequest{PostId: int32(adv.PublicationID), Username: "username"})
		campPost := campaign.AdvertisementResponse{
			Id:              int32(adv.ID),
			CampaignId:      int32(adv.CampaignID),
			PublicationId:   int32(adv.PublicationID),
			PublicationType: int32(adv.PublicationType),
			Username:        post.Username,
			LocationName:    post.LocationName,
			Description:     post.Description,
			CreatedAt:       post.CreatedAt,
			Hashtags:        post.Hashtags,
			Tags:            post.Tags,
			ImageUrls:       post.ImageUrls,
			//Link:            adv.Link,
		}
		if isInfluenser {
			campPost.Username = influenser
		}
		return &campPost
	} else {
		story, _ := s.postClient.GetStoryRequest(ctx, &helloworld.ActionRequest{PostId: int32(adv.PublicationID), Username: "username"})
		campStory := campaign.AdvertisementResponse{
			Id:              int32(adv.ID),
			CampaignId:      int32(adv.CampaignID),
			PublicationId:   int32(adv.PublicationID),
			PublicationType: int32(adv.PublicationType),
			Username:        story.Username,
			LocationName:    story.LocationName,
			Description:     story.Description,
			CreatedAt:       story.CreatedAt,
			Hashtags:        story.Hashtags,
			Tags:            story.Tags,
			ImageUrls:       story.ImageUrls,
			//Link:            adv.Link,
		}
		if isInfluenser {
			campStory.Username = influenser
		}
		return &campStory
	}
}

func makeStringFromUsernames(usernames []store.Username) []string {
	ret := []string{}
	for _, usr := range usernames {
		ret = append(ret, usr.Name)
	}
	return ret
}

func makeCampaignFromProto(campaign *campaign.Campaign) *store.Campaign {
	layout := "2006-01-02T15:04:05.000Z"
	startTime, _ := time.Parse(layout, campaign.Start)
	endTime, _ := time.Parse(layout, campaign.End)

	return &store.Campaign{
		ID:         int(campaign.Id),
		Username:   campaign.Username,
		CreatedAt:  time.Now(),
		Start:      startTime,
		End:        endTime,
		ShowNumber: int(campaign.ShowNumber),
		//TargetAudience: influensersToUsernames(campaign.TargetAudience),
		Influensers: influensersToUsernames(campaign.Influensers),
		EditFor:     int(campaign.EditFor),
	}
}

func makeAdvertisementFromProto(advertisement *campaign.Advertisement) *store.Advertisement {
	return &store.Advertisement{
		ID:              int(advertisement.Id),
		CampaignID:      int(advertisement.CampaignId),
		PublicationID:   int(advertisement.PublicationId),
		PublicationType: int(advertisement.PublicationType),
		Link:            advertisement.Link,
	}
}

func influensersToUsernames(influensers []string) []store.Username {
	var usernames []store.Username
	for _, influenser := range influensers {
		usernames = append(usernames, store.Username{Name: influenser})
	}
	return usernames
}

func (s *server) GetInfluensersAds(ctx context.Context, username string, postType int) *campaign.Advertisements {
	ads, err := s.store.GetInfluensersAdvertisementsByUser(ctx, username, postType)
	if err != nil {
		return &campaign.Advertisements{}
	}
	return s.makeInfluensersAdvertisementsProto(ctx, ads, username)
}

func (s *server) makeInfluensersAdvertisementsProto(ctx context.Context, ads []store.Advertisement, requester string) *campaign.Advertisements {
	followList := GetFollowList(requester)
	list := []*campaign.AdvertisementResponse{}
	for _, ad := range ads {
		usernames := s.store.GetInfluensersUsernamesByCampaign(ctx, ad.CampaignID)
		for _, username := range usernames {
			if s.store.IsInfluenserCampaignApproved(ctx, ad.CampaignID, username) && contains(followList, username) {
				list = append(list, s.makeAdvertisementResponseProto(ctx, &ad, true, username))
			}
		}
	}
	return &campaign.Advertisements{
		Advertisements: list,
	}
}

func GetFollowList(username string) []string {
	if username == "" {
		return GetPublicList()
	}
	ret := []string{}
	ret = append(ret, "username")
	ret = append(ret, "test")
	ret = append(ret, "username2")
	return ret
}

func GetPublicList() []string {
	ret := []string{}
	ret = append(ret, "test")
	return ret
}

func GetTargetAudience(ageFrom int, ageTo int) []campaignstore.Username {
	ret := []campaignstore.Username{}
	ret = append(ret, campaignstore.Username{Name: "username11"})
	ret = append(ret, campaignstore.Username{Name: "username12"})
	return ret
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
	resp, err := http.Get("http://bezbednost:8081/auth/getUsernameByToken/" + parts[1])
	if err != nil {
		fmt.Println(err)
		return ""
	}
	defer resp.Body.Close()
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println(string(b))
	return string(b)
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func unique(intSlice []int) []int {
	keys := make(map[int]bool)
	list := []int{}
	for _, entry := range intSlice {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			list = append(list, entry)
		}
	}
	return list
}