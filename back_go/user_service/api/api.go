package api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"back_go/user_service/helpers"
	//"back_go/auth_service/registration2/useraccounts"
	"back_go/user_service/users"

	"github.com/gorilla/mux"
)

type User struct {
	FirstName string
	LastName  string
	Username  string
	Email     string
	Password  string
}

type UserInfo struct {
	User_id       uint
	Gender        string
	Date_of_birth string
	Phone         string
	Website       string
	Biography     string
}

type WholeUser struct {
	FirstName     string
	LastName      string
	Username      string
	Email         string
	Password      string
	User_id       uint
	Gender        string
	Date_of_birth string
	Phone         string
	Website       string
	Biography     string
}

// Create readBody function
func readBody(r *http.Request) []byte {
	body, err := ioutil.ReadAll(r.Body)
	helpers.HandleErr(err)

	return body
}

// Refactor apiResponse
func apiResponse(call map[string]interface{}, w http.ResponseWriter) {
	if call["message"] == "all is fine" {
		resp := call
		json.NewEncoder(w).Encode(resp)
		// Handle error in else
	} else {
		resp := call
		json.NewEncoder(w).Encode(resp)
	}
}

func edit_user(w http.ResponseWriter, r *http.Request) {
	// Refactor login to use readBody
	body := readBody(r)

	var formattedBody WholeUser

	err := json.Unmarshal(body, &formattedBody)
	helpers.HandleErr(err)

	edit := users.EditUser(formattedBody.FirstName, formattedBody.LastName, formattedBody.Username, formattedBody.Email,
		formattedBody.User_id, formattedBody.Gender, formattedBody.Date_of_birth, formattedBody.Phone, formattedBody.Website, formattedBody.Biography)
	// Refactor register to use apiResponse function
	apiResponse(edit, w)
}

func getUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["id"]
	auth := r.Header.Get("Authorization")

	user := users.GetUser(userId, auth)
	apiResponse(user, w)
}

func StartApi() {
	router := mux.NewRouter()
	// Add panic handler middleware
	router.Use(helpers.PanicHandler)
	router.HandleFunc("/edit", edit_user).Methods("POST")
	//router.HandleFunc("/login", login).Methods("POST")
	//router.HandleFunc("/register", register).Methods("POST")
	router.HandleFunc("/user/{id}", getUser).Methods("GET")
	fmt.Println("App is working on port :23002")
	log.Fatal(http.ListenAndServe(":23002", router))
}
