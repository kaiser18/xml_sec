package api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	//"log"
	"net/http"
	//"path/filepath"
	//"os"

	"back_go/user_service/helpers"
	"back_go/user_service/users"

	log "github.com/sirupsen/logrus"

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

type UserProfileSettings struct {
	User_id uint
	//Username string
	Private_profile                    bool
	Accept_unfollowed_account_messages bool
	Tagging                            bool
	Muted_blocked_accounts             string
}

type UserNotificationSettings struct {
	User_id                  uint
	Likes                    string
	Comments                 string
	Accepted_follow_requests string
	Posts                    string
	Stories                  string
	Messages                 string
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

	log.WithFields(log.Fields{
		"method":   r.Method,
		"path":     r.URL,
		"agent":    r.UserAgent(),
		"response": r.Response,
		"host":     r.Host,
		"proto":    r.Proto,
		"service":  "user_service",
	}).Info("request details")
}

func getUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["id"]
	auth := r.Header.Get("Authorization")

	user := users.GetUser(userId, auth)
	apiResponse(user, w)

	log.WithFields(log.Fields{
		"method":   r.Method,
		"path":     r.URL,
		"agent":    r.UserAgent(),
		"response": r.Response,
		"host":     r.Host,
		"proto":    r.Proto,
		"service":  "user_service",
	}).Info("request details")
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]
	id := vars["id"]

	users := users.GetUsers(username, id)
	apiResponse(users, w)
}

func edit_user_profile_settings(w http.ResponseWriter, r *http.Request) {

	body := readBody(r)
	var formattedBody UserProfileSettings

	err := json.Unmarshal(body, &formattedBody)
	helpers.HandleErr(err)

	edit := users.EditUserProfile(formattedBody.User_id, formattedBody.Private_profile, formattedBody.Accept_unfollowed_account_messages,
		formattedBody.Tagging)
	// Refactor register to use apiResponse function
	apiResponse(edit, w)
}

func getUserProfileSettings(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["id"]
	//auth := r.Header.Get("Authorization")

	user := users.GetUserProfileSettings(userId)
	apiResponse(user, w)
}

func edit_notification_settings(w http.ResponseWriter, r *http.Request) {

	body := readBody(r)
	var formattedBody UserNotificationSettings

	err := json.Unmarshal(body, &formattedBody)
	helpers.HandleErr(err)

	edit := users.EditUserNotification(formattedBody.User_id, formattedBody.Likes, formattedBody.Comments,
		formattedBody.Accepted_follow_requests, formattedBody.Posts, formattedBody.Stories, formattedBody.Messages)

	apiResponse(edit, w)
}

func getUserNotificationSettings(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["id"]
	//auth := r.Header.Get("Authorization")

	user := users.GetUserNotificationSettings(userId)
	apiResponse(user, w)
}

func userMuteBlockOption(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	option := vars["option"]
	//auth := r.Header.Get("Authorization")
	body := readBody(r)
	var formattedBody UserProfileSettings

	err := json.Unmarshal(body, &formattedBody)
	helpers.HandleErr(err)

	user := users.UserMuteBlockOption(option, formattedBody.User_id, formattedBody.Muted_blocked_accounts)
	apiResponse(user, w)
}

func StartApi() {
	router := mux.NewRouter()
	// Add panic handler middleware
	router.Use(helpers.PanicHandler)
	router.HandleFunc("/edit", edit_user).Methods("POST")
	router.HandleFunc("/user/{id}", getUser).Methods("GET")
	router.HandleFunc("/users/{username}/{id}", getUsers).Methods("GET")
	router.HandleFunc("/accounts/edit/profile_settings", edit_user_profile_settings).Methods("POST")
	router.HandleFunc("/accounts/user_settings/{id}", getUserProfileSettings).Methods("GET")
	router.HandleFunc("/accounts/edit/notification_settings", edit_notification_settings).Methods("POST")
	router.HandleFunc("/accounts/notification_settings/{id}", getUserNotificationSettings).Methods("GET")
	router.HandleFunc("/user/report/{option}", userMuteBlockOption).Methods("POST")
	log.Info("App is working on port :23002")
	fmt.Println("App is working on port :23002")
	log.Fatal(http.ListenAndServe(":23002", router))
}
