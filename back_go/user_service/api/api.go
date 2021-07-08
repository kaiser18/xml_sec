package api

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"strconv"

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
	Name          string
	Surname       string
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
	ProfileToUnfollow                  string
	ProfileToAddToCF                   string
	ProfileToRemoveCF                  string
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

type FollowRequest struct {
	User_id             uint
	Requester_id        uint
	FollowRequestStatus FollowRequestStatus
}

type FollowRequestStatus string

const (
	PENDING  FollowRequestStatus = "PENDING"
	ACCEPTED FollowRequestStatus = "ACCEPTED"
	DENIED   FollowRequestStatus = "DENIED"
)

type FollowRequestUpdateStatus struct {
	User_id      uint
	Requester_id uint
	Status       bool
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

func apiResponseInt(call []int, w http.ResponseWriter) {
	resp := call
	json.NewEncoder(w).Encode(resp)
}

func edit_user(w http.ResponseWriter, r *http.Request) {
	// Refactor login to use readBody
	body := readBody(r)

	var formattedBody WholeUser

	err := json.Unmarshal(body, &formattedBody)
	helpers.HandleErr(err)

	edit := users.EditUser(formattedBody.Name, formattedBody.Surname, formattedBody.Username, formattedBody.Email,
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

func canITag(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]

	id := users.GetIdFromUsername(username)
	res := users.IsUserTaggable(id)
	if res {
		w.WriteHeader(200)
		w.Header().Set("Status", "200")
	} else {
		w.WriteHeader(400)
		w.Header().Set("Status", "400")
	}
}

func GetUserProfilePic(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]

	id := users.GetIdFromUsername(username)
	pic := users.GetUserProfilePic(id)
	io.WriteString(w, pic)
}

func FilterUsers(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	criteria := vars["criteria"]

	users := users.FilterUsers(criteria)

	w.Header().Set("Content-Type", "application/json")
	ret, _ := json.Marshal(users)
	io.WriteString(w, string(ret))
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

func GetFollowers(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["id"]
	//auth := r.Header.Get("Authorization")

	user := users.GetFollowers(userId)
	apiResponseInt(user, w)
}

func GetFollowing(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["id"]
	//auth := r.Header.Get("Authorization")

	user := users.GetFollowing(userId)
	apiResponseInt(user, w)
}

func FindPublicAccounts(w http.ResponseWriter, r *http.Request) {
	res := users.GetPublicAccounts()

	usernames := []string{}
	for _, id := range res {
		usernames = append(usernames, users.GetUsernameFromId(uint(id)))
	}

	w.Header().Set("Content-Type", "application/json")
	ret, _ := json.Marshal(usernames)
	io.WriteString(w, string(ret))
}

func FindTargetAudience(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	ageFromS := vars["ageFrom"]
	ageToS := vars["ageTo"]
	ageFrom, _ := strconv.Atoi(ageFromS)
	ageTo, _ := strconv.Atoi(ageToS)

	res := users.GetTargetAudience(ageFrom, ageTo)

	usernames := []string{}
	for _, id := range res {
		usernames = append(usernames, users.GetUsernameFromId(uint(id)))
	}

	w.Header().Set("Content-Type", "application/json")
	ret, _ := json.Marshal(usernames)
	io.WriteString(w, string(ret))
}

func FindFollowers(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]

	id := users.GetIdFromUsername(username)

	followers := users.GetFollowers(fmt.Sprint(id))

	usernames := []string{}
	for _, id := range followers {
		usernames = append(usernames, users.GetUsernameFromId(uint(id)))
	}

	w.Header().Set("Content-Type", "application/json")
	ret, _ := json.Marshal(usernames)
	io.WriteString(w, string(ret))
}

func FindFollowing(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]

	id := users.GetIdFromUsername(username)

	following := users.GetFollowing(fmt.Sprint(id))
	muted := users.GetMutedAccounts(fmt.Sprint(id))
	blocked := users.GetBlockedAccounts(fmt.Sprint(id))

	filteredFollowings := []int{}
	for _, id := range following {
		if helpers.Contains(muted, id) || helpers.Contains(blocked, id) {
			continue
		}
		filteredFollowings = append(filteredFollowings, id)
	}

	usernames := []string{}
	for _, id := range filteredFollowings {
		if users.IsUserBlocked(id) {
			continue
		}
		usernames = append(usernames, users.GetUsernameFromId(uint(id)))
	}

	w.Header().Set("Content-Type", "application/json")
	ret, _ := json.Marshal(usernames)
	io.WriteString(w, string(ret))
}

func IsUserBlocked(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	requester := vars["requester"]
	username := vars["username"]

	id := users.GetIdFromUsername(requester)
	id2 := users.GetIdFromUsername(username)

	blocked := users.GetBlockedAccounts(fmt.Sprint(id))

	w.Header().Set("Content-Type", "application/json")
	ret, _ := json.Marshal(helpers.Contains(blocked, int(id2)))
	io.WriteString(w, string(ret))
}

func FindAllFollowings(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]

	id := users.GetIdFromUsername(username)

	following := users.GetFollowing(fmt.Sprint(id))

	usernames := []string{}
	for _, id := range following {
		if users.IsUserBlocked(id) {
			continue
		}
		usernames = append(usernames, users.GetUsernameFromId(uint(id)))
	}

	w.Header().Set("Content-Type", "application/json")
	ret, _ := json.Marshal(usernames)
	io.WriteString(w, string(ret))
}

func GetCloseFriends(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId := vars["id"]
	//auth := r.Header.Get("Authorization")

	user := users.GetCloseFriends(userId)
	apiResponseInt(user, w)
}

func Unfollow(w http.ResponseWriter, r *http.Request) {
	//auth := r.Header.Get("Authorization")
	body := readBody(r)
	var formattedBody UserProfileSettings

	err := json.Unmarshal(body, &formattedBody)
	helpers.HandleErr(err)

	user := users.Unfollow(formattedBody.User_id, formattedBody.ProfileToUnfollow)
	apiResponse(user, w)
}

func AddToCloseFriends(w http.ResponseWriter, r *http.Request) {
	//auth := r.Header.Get("Authorization")
	body := readBody(r)
	var formattedBody UserProfileSettings

	err := json.Unmarshal(body, &formattedBody)
	helpers.HandleErr(err)

	user := users.AddToCloseFriends(formattedBody.User_id, formattedBody.ProfileToAddToCF)
	apiResponse(user, w)
}

func RemoveFromCloseFriends(w http.ResponseWriter, r *http.Request) {
	//auth := r.Header.Get("Authorization")
	body := readBody(r)
	var formattedBody UserProfileSettings

	err := json.Unmarshal(body, &formattedBody)
	helpers.HandleErr(err)

	user := users.RemoveFromCloseFriends(formattedBody.User_id, formattedBody.ProfileToRemoveCF)
	apiResponse(user, w)
}

func CreateFollowRequest(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]
	body := readBody(r)
	var formattedBody FollowRequest

	user_id := users.GetIdFromUsername(username)
	requester_username := users.GetUsernameFromId(formattedBody.Requester_id)

	err := json.Unmarshal(body, &formattedBody)
	helpers.HandleErr(err)

	request := users.CreateFollowRequest(user_id, requester_username)

	apiResponse(request, w)
}

func GetFollowRequests(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	user_id, _ := strconv.Atoi(id)

	requests := users.GetFollowRequestsForUser(uint(user_id))

	w.Header().Set("Content-Type", "application/json")
	ret, _ := json.Marshal(requests)
	io.WriteString(w, string(ret))
}

func UpdateStatusOfRequest(w http.ResponseWriter, r *http.Request) {
	body := readBody(r)
	var formattedBody FollowRequestUpdateStatus

	err := json.Unmarshal(body, &formattedBody)
	helpers.HandleErr(err)

	request := users.UpdateStatusOfFollowRequest(formattedBody.User_id, formattedBody.Requester_id, formattedBody.Status)

	w.Header().Set("Content-Type", "application/json")
	ret, _ := json.Marshal(request)
	io.WriteString(w, string(ret))
}

func StartApi() {
	router := mux.NewRouter()
	// Add panic handler middleware
	router.Use(helpers.PanicHandler)
	router.HandleFunc("/edit", edit_user).Methods("POST")
	router.HandleFunc("/user/{id}", getUser).Methods("GET")
	router.HandleFunc("/canITag/{username}", canITag).Methods("GET")
	router.HandleFunc("/userProfilePic/{username}", GetUserProfilePic).Methods("GET")
	router.HandleFunc("/users/{username}/{id}", getUsers).Methods("GET")
	router.HandleFunc("/users/{criteria}", FilterUsers).Methods("GET")
	router.HandleFunc("/accounts/edit/profile_settings", edit_user_profile_settings).Methods("POST")
	router.HandleFunc("/accounts/user_settings/{id}", getUserProfileSettings).Methods("GET")
	router.HandleFunc("/accounts/edit/notification_settings", edit_notification_settings).Methods("POST")
	router.HandleFunc("/accounts/notification_settings/{id}", getUserNotificationSettings).Methods("GET")
	router.HandleFunc("/user/report/{option}", userMuteBlockOption).Methods("POST")
	router.HandleFunc("/user/followers/{id}", GetFollowers).Methods("GET")
	router.HandleFunc("/user/following/{id}", GetFollowing).Methods("GET")
	router.HandleFunc("/followers/{username}", FindFollowers).Methods("GET")
	router.HandleFunc("/following/{username}", FindFollowing).Methods("GET")
	router.HandleFunc("/findAllFollowings/{username}", FindAllFollowings).Methods("GET")
	router.HandleFunc("/targetAudience/{ageFrom}/{ageTo}", FindTargetAudience).Methods("GET")
	router.HandleFunc("/public", FindPublicAccounts).Methods("GET")
	router.HandleFunc("/IsUserBlocked/{requester}/{username}", IsUserBlocked).Methods("GET")
	router.HandleFunc("/user/closeFriends/{id}", GetCloseFriends).Methods("GET")
	router.HandleFunc("user/unfollow", Unfollow).Methods("POST")
	router.HandleFunc("user/addToCloseFriends", AddToCloseFriends).Methods("POST")
	router.HandleFunc("user/removeFromCloseFriends", RemoveFromCloseFriends).Methods("POST")
	router.HandleFunc("user/follow/{username}", CreateFollowRequest).Methods("POST")
	router.HandleFunc("user/requests/{id}", GetFollowRequests).Methods("GET")
	router.HandleFunc("user/requests/update", UpdateStatusOfRequest).Methods("POST")

	log.Info("App is working on port :23002")
	fmt.Println("App is working on port :23002")
	log.Fatal(http.ListenAndServe(":23002", router))
}
