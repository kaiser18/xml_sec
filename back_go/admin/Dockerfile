FROM golang:latest as builder
FROM golang:1.15-alpine3.13
WORKDIR app
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN go build -o Admin
EXPOSE 9009
CMD ["./Admin"]