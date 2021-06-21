package main

import (
	"context"
	//"log"
	"net"
	"net/http"

	grpc_opentracing "github.com/grpc-ecosystem/go-grpc-middleware/tracing/opentracing"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	pbPost "github.com/nikolablesic/proto/helloworld"
	pbSearch "github.com/nikolablesic/proto/search"
	otgo "github.com/opentracing/opentracing-go"
	"google.golang.org/grpc"

	"search/logger"

	log "github.com/sirupsen/logrus"
)

func main() {
	log.Println("Zapocinjem...")
	logger.FileOpen()
	postConn, err := grpc.Dial("post:8080", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("failed to dial post service: %s", err)
	}
	greeterClient := pbPost.NewGreeterClient(postConn)
	// Create a listener on TCP port
	lis, err := net.Listen("tcp", ":9000")
	if err != nil {
		log.Fatalln("Failed to listen:", err)
	}

	// Create a gRPC server object
	s := grpc.NewServer()

	service, err := NewServer(greeterClient)
	if err != nil {
		log.Fatal(err.Error())
		return
	}

	// Attach the Greeter service to the server
	pbSearch.RegisterSearchServer(s, service)
	// Serve gRPC server
	log.Println("Serving gRPC on 0.0.0.0:9000")
	go func() {
		log.Fatalln(s.Serve(lis))
	}()

	// Create a client connection to the gRPC server we just started
	// This is where the gRPC-Gateway proxies the requests
	conn, err := grpc.DialContext(
		context.Background(),
		"0.0.0.0:9000",
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

	gwmux := runtime.NewServeMux()
	// Register Greeter
	err = pbSearch.RegisterSearchHandler(context.Background(), gwmux, conn)
	if err != nil {
		log.Fatalln("Failed to register gateway:", err)
	}

	gwServer := &http.Server{
		Addr:    ":9001",
		Handler: tracingWrapper(gwmux),
	}

	log.Println("Serving gRPC-Gateway on http://0.0.0.0:9001")
	log.Fatalln(gwServer.ListenAndServe())
}
