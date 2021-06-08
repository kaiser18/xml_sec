FROM golang:latest as builder
FROM golang:1.15-alpine3.13
WORKDIR app
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN go build -o Search
EXPOSE 9001
CMD ["./Search"]