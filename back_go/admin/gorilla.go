package main

import (
	"context"
	//"log"
	"net"
	"net/http"

	"github.com/nikolablesic/proto/admin"
	"github.com/nikolablesic/proto/helloworld"

	"admin/logger"

	grpc_opentracing "github.com/grpc-ecosystem/go-grpc-middleware/tracing/opentracing"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	otgo "github.com/opentracing/opentracing-go"
	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc"
)

func main() {
	logger.FileOpen()
	postConn, err := grpc.Dial("post:8080", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("failed to dial post service: %s", err)
	}
	postClient := helloworld.NewGreeterClient(postConn)
	// Create a listener on TCP port
	lis, err := net.Listen("tcp", ":9007")
	if err != nil {
		log.Fatalln("Failed to listen:", err)
	}

	// Create a gRPC server object
	s := grpc.NewServer()

	service, err := NewServer(postClient)
	if err != nil {
		log.Fatal(err.Error())
		return
	}

	go service.orchestrator.Start()
	go service.RedisConnection()

	// Attach the Greeter service to the server
	admin.RegisterAdminServer(s, service)
	// Serve gRPC server
	log.Println("Serving gRPC on 0.0.0.0:9007")
	go func() {
		log.Fatalln(s.Serve(lis))
	}()

	// Create a client connection to the gRPC server we just started
	// This is where the gRPC-Gateway proxies the requests
	conn, err := grpc.DialContext(
		context.Background(),
		"0.0.0.0:9007",
		grpc.WithBlock(),
		grpc.WithInsecure(),
		grpc.WithUnaryInterceptor(
			grpc_opentracing.UnaryClientInterceptor(
				grpc_opentracing.WithTracer(otgo.GlobalTracer()),
			),
		),
		grpc.WithStreamInterceptor(
			grpc_opentracing.StreamClientInterceptor(
				grpc_opentracing.WithTracer(otgo.GlobalTracer()),
			),
		),
	)
	if err != nil {
		log.Fatalln("Failed to dial server:", err)
	}
	log.Info(conn)

	gwmux := runtime.NewServeMux()
	// Register Greeter
	err = admin.RegisterAdminHandler(context.Background(), gwmux, conn)
	if err != nil {
		log.Fatalln("Failed to register gateway:", err)
	}

	gwServer := &http.Server{
		Addr:    ":9008",
		Handler: tracingWrapper(gwmux),
	}

	log.Println("Serving gRPC-Gateway on http://0.0.0.0:9008")
	log.Fatalln(gwServer.ListenAndServe())
}
