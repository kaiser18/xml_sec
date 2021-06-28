package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/mux"
)

func uploadFile(w http.ResponseWriter, request *http.Request) {
	request.ParseMultipartForm(10 * 1024 * 1024)
	files := request.MultipartForm.File["uploads"]
	var ret []string
	for _, file := range files {
		fileType := file.Header.Get("Content-Type")
		parts := strings.Split(fileType, "/")
		fileExtension := parts[1]
		printFileDetails(file)

		f, _ := file.Open()
		tempFile, err := ioutil.TempFile("uploads", "upload-*."+fileExtension)
		ret = append(ret, tempFile.Name())
		if err != nil {
			fmt.Println(err)
		}
		defer tempFile.Close()

		fileBytes, err := ioutil.ReadAll(f)
		if err != nil {
			fmt.Println(err)
		}
		tempFile.Write(fileBytes)
	}
	out, _ := json.Marshal(ret)
	w.Write(out)
}

func printFileDetails(file *multipart.FileHeader) {
	fmt.Println("File name:", file.Filename)
	fmt.Println("File size:", file.Size)
	fmt.Println("File type:", file.Header.Get("Content-Type"))
	fmt.Println("---------------------")
}

func setupRoutes() {
	router := mux.NewRouter()
	port := os.Getenv("PORT")
	router.HandleFunc("/upload", uploadFile).Methods("POST")
	http.ListenAndServe(":"+port, router)
}

func main() {
	setupRoutes()
}
