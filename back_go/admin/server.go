package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"strings"

	//"log"
	"admin/adminstore"
	"admin/saga"
	"net/http"

	"github.com/nikolablesic/proto/admin"
	"github.com/nikolablesic/proto/helloworld"
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

func (oss *server) RedisConnection() {
	// create client and ping redis
	var err error
	client := redis.NewClient(&redis.Options{Addr: "redis:6379", Password: "", DB: 0})
	if _, err = client.Ping().Result(); err != nil {
		log.Fatalf("error creating redis client %s", err)
	}

	// subscribe to the required channels
	pubsub := client.Subscribe(saga.AdminChannel, saga.ReplyChannel)
	if _, err = pubsub.Receive(); err != nil {
		log.Fatalf("error subscribing %s", err)
	}
	defer func() { _ = pubsub.Close() }()
	ch := pubsub.Channel()

	log.Println("starting the order service")
	for {
		select {
		case msg := <-ch:
			m := saga.Message{}
			err := json.Unmarshal([]byte(msg.Payload), &m)
			if err != nil {
				log.Println(err)
				continue
			}

			switch msg.Channel {
			case saga.AdminChannel:

				// Happy Flow
				if m.Action == saga.ActionStart {

					reportId := m.ReportId

					if m.SenderService == saga.ServicePost {
						if m.Ok {
							oss.store.UpdateReportRequestStatus(reportId, "SUCCESS")
							sendToReplyChannel(client, &m, saga.ActionDone, saga.ServicePost, saga.ServiceAdmin)
						} else {
							oss.store.UpdateReportRequestStatus(reportId, "REJECTED")
						}

					} else {
						oss.store.UpdateReportRequestStatus(reportId, "FINISHED")
					}

				}

				// Rollback flow
				if m.Action == saga.ActionRollback {
					oss.store.UpdateReportRequestStatus(m.ReportId, "ERROR")
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
	orchestrator *saga.Orchestrator
	admin.UnimplementedAdminServer
	postClient helloworld.GreeterClient
	store      *adminstore.AdminStore
	tracer     otgo.Tracer
	closer     io.Closer
}

const name = "admin_service"

func NewServer(postClient helloworld.GreeterClient) (*server, error) {
	store, err := adminstore.New()
	if err != nil {
		log.Error(err)
		return nil, err
	}

	tracer, closer := tracer.Init(name)
	otgo.SetGlobalTracer(tracer)
	return &server{
		orchestrator: saga.NewOrchestrator(),
		store:        store,
		tracer:       tracer,
		closer:       closer,
		postClient:   postClient,
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

func (s *server) ReportRequest(ctx context.Context, in *admin.CreateReportRequest) (*admin.Identifier, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &admin.Identifier{}, status.Error(401, "401 Unauthorized")
	}
	id, err := s.store.CreateReport(ctx, int(in.Request.Id), username, in.Request.Type)
	if err != nil {
		log.Error(err)
	}
	m := saga.Message{Service: saga.ServicePost, SenderService: saga.ServiceAdmin, Action: saga.ActionStart, ReportId: id, PublicationId: int(in.Request.Id), PublicationType: in.Request.Type}
	s.orchestrator.Next(saga.PostChannel, saga.ServicePost, m)
	return &admin.Identifier{
		Id: int32(id),
	}, err
}

func (s *server) DeleteReportRequest(ctx context.Context, in *admin.Identifier) (*admin.Empty, error) {
	return &admin.Empty{}, s.store.DeleteReport(ctx, int(in.Id))
}

func (s *server) RemovePublicationRequest(ctx context.Context, in *admin.Identifier) (*admin.Empty, error) {
	report, err := s.store.GetReport(ctx, int(in.Id))
	if err != nil {
		log.Error(err)
		return &admin.Empty{}, err
	}
	err = s.store.DeleteReport(ctx, int(in.Id))
	if err != nil {
		log.Error(err)
		return &admin.Empty{}, err
	}
	if report.Type == "POST" {
		_, err = s.postClient.DeletePostRequest(ctx, &helloworld.ActionRequest{
			PostId:   int32(report.PublicationID),
			Username: "",
		})
	} else if report.Type == "STORY" {
		_, err = s.postClient.DeleteStoryRequest(ctx, &helloworld.ActionRequest{
			PostId:   int32(report.PublicationID),
			Username: "",
		})
	}
	return &admin.Empty{}, err
}

func (s *server) GetReportsRequest(ctx context.Context, in *admin.Empty) (*admin.Reports, error) {
	reports, err := s.store.GetReports(ctx)
	if err != nil {
		log.Error(err)
		return &admin.Reports{}, err
	}

	ret := []*admin.ReportResp{}

	for _, report := range reports {
		if report.Type == "POST" {
			post, err := s.postClient.GetPostRequest(ctx, &helloworld.ActionRequest{
				PostId:   int32(report.PublicationID),
				Username: "",
			})
			if err == nil {
				rep := CreateReportForPost(report, post)
				ret = append(ret, reportToProto(rep))
			}
		} else if report.Type == "STORY" {
			post, err := s.postClient.GetStoryRequest(ctx, &helloworld.ActionRequest{
				PostId:   int32(report.PublicationID),
				Username: "",
			})
			if err == nil {
				rep := CreateReportForStory(report, post)
				ret = append(ret, reportToProto(rep))
			}
		}
	}

	return &admin.Reports{
		Reports: ret,
	}, nil
}

func (s *server) GetReportsForUserRequest(ctx context.Context, in *admin.Empty) (*admin.ReportResponses, error) {
	username := GetUsernameOfLoggedUser(ctx)
	if len(username) <= 0 {
		return &admin.ReportResponses{}, status.Error(401, "401 Unauthorized")
	}
	reports, err := s.store.GetReportsForUser(ctx, username)
	if err != nil {
		log.Error(err)
		return &admin.ReportResponses{}, err
	}

	ret := []*admin.ReportResponse{}

	for _, report := range reports {
		ret = append(ret, &admin.ReportResponse{
			Id:              int32(report.ID),
			PublicationId:   int32(report.PublicationID),
			PublicationType: report.Type,
			Status:          report.Status,
		})
	}

	return &admin.ReportResponses{
		Reports: ret,
	}, nil
}

func (s *server) BlockAccountRequest(ctx context.Context, in *admin.BlockAccountReq) (*admin.Empty, error) {
	return &admin.Empty{}, nil
}

func CreateReportForPost(report adminstore.ReportRequest, post *helloworld.Post) Report {
	return Report{
		Id:               report.ID,
		ReporterUsername: report.ReporterUsername,
		Username:         post.Username,
		UserProfilePic:   GetUserProfilePic(post.Username),
		LocationName:     post.LocationName,
		Description:      post.Description,
		Hashtags:         post.Hashtags,
		Tags:             post.Tags,
		ImageUrls:        post.ImageUrls,
		Type:             report.Type,
		Status:           report.Status,
	}
}

func CreateReportForStory(report adminstore.ReportRequest, post *helloworld.Story) Report {
	return Report{
		Id:               report.ID,
		ReporterUsername: report.ReporterUsername,
		Username:         post.Username,
		UserProfilePic:   GetUserProfilePic(post.Username),
		LocationName:     post.LocationName,
		Description:      post.Description,
		Hashtags:         post.Hashtags,
		Tags:             post.Tags,
		ImageUrls:        post.ImageUrls,
		Type:             report.Type,
		Status:           report.Status,
	}
}

func reportToProto(report Report) *admin.ReportResp {
	return &admin.ReportResp{
		Id:               int32(report.Id),
		ReporterUsername: report.ReporterUsername,
		Username:         report.Username,
		UserProfilePic:   report.UserProfilePic,
		LocationName:     report.LocationName,
		Description:      report.Description,
		Hashtags:         report.Hashtags,
		Tags:             report.Tags,
		ImageUrls:        report.ImageUrls,
		Type:             report.Type,
		Status:           report.Status,
	}
}

func GetUserProfilePic(username string) string {
	resp, err := http.Get("http://user_service:23002/userProfilePic/" + username)
	if err != nil {
		fmt.Println(err)
		return ""
	}
	defer resp.Body.Close()
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		return ""
	}
	return string(b)
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
		fmt.Println(err)
	}
	log.Println(string(b))
	return string(b)
}

func (s *server) GetVerificationRequestsRequest(ctx context.Context, in *admin.Empty) (*admin.VerificationRequests, error) {
	requests, err := s.store.GetVerificationRequests(ctx)
	if err != nil {
		log.Error(err)
		return &admin.VerificationRequests{}, err
	}

	ret := []*admin.VerificationResp{}

	for _, vr := range requests {
		ret = append(ret, &admin.VerificationResp{
			Id:       int32(vr.ID),
			Name:     vr.Name,
			Surname:  vr.Surname,
			Category: vr.Category,
			Username: vr.Username,
			Approved: vr.Approved,
		})
	}
	return &admin.VerificationRequests{
		VerificationRequests: ret,
	}, nil
}

func (s *server) VerificationRequest(ctx context.Context, in *admin.CreateVerificationRequest) (*admin.Identifier, error) {
	id, err := s.store.CreateVerificationRequest(ctx, in.Request.Name, in.Request.Surname, in.Request.Category, in.Request.Username)

	if err != nil {
		log.Error(err)
	}
	return &admin.Identifier{
		Id: int32(id),
	}, err
}

func (s *server) UpdateVerificationRequest(ctx context.Context, in *admin.UpdateVerificationReq) (*admin.Empty, error) {
	return &admin.Empty{}, s.store.UpdateVerificationRequestStatus(ctx, int(in.Request.Id), in.Request.Approved)
}
