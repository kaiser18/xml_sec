package users

import (
	"time"
	//"fmt"
	"strconv"
	"strings"

	"back_go/user_service/database"
	"back_go/user_service/helpers"
	"back_go/user_service/interfaces"

	"github.com/dgrijalva/jwt-go"
	log "github.com/sirupsen/logrus"
	//"golang.org/x/crypto/bcrypt"
)

// Refactor prepareToken
func prepareToken(user *interfaces.User) string {
	tokenContent := jwt.MapClaims{
		"user_id": user.ID,
		"expiry":  time.Now().Add(time.Minute * 60).Unix(),
	}
	jwtToken := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tokenContent)
	token, err := jwtToken.SignedString([]byte("TokenPassword"))
	helpers.HandleErr(err)

	return token
}

// Refactor prepareResponse
func prepareResponse(user *interfaces.User, withToken bool) map[string]interface{} {
	responseUser := &interfaces.ResponseUser{
		ID: user.ID,
		//Name: user.Name,
		//Surname: user.Surname,
		Username: user.Username,
		Email:    user.Email,
	}
	var response = map[string]interface{}{"message": "all is fine"}
	// Add withToken feature to prepare response
	if withToken {
		var token = prepareToken(user)
		response["jwt"] = token
	}
	response["data"] = responseUser
	return response
}

func prepareFullResponse(user *interfaces.User, userInfo *interfaces.UserInfo, withToken bool) map[string]interface{} {
	responseUser := &interfaces.ResponseWholeUser{
		ID:            user.ID,
		Name:          user.First_name,
		Surname:       user.Last_name,
		Username:      user.Username,
		Email:         user.Email,
		Gender:        userInfo.Gender,
		Date_of_birth: userInfo.Date_of_birth.String(),
		Phone:         userInfo.Phone,
		Website:       userInfo.Website,
		Biography:     userInfo.Biography,
		IsBlocked:     user.IsBlocked,
	}
	var response = map[string]interface{}{"message": "all is fine"}
	// Add withToken feature to prepare response
	if withToken {
		var token = prepareToken(user)
		response["jwt"] = token
	}
	response["data"] = responseUser
	return response
}

func convertToResponseWholeUser(user *interfaces.User, userInfo *interfaces.UserInfo) *interfaces.ResponseWholeUser {
	return &interfaces.ResponseWholeUser{
		ID:            user.ID,
		Name:          user.First_name,
		Surname:       user.Last_name,
		Username:      user.Username,
		Email:         user.Email,
		Gender:        userInfo.Gender,
		Date_of_birth: userInfo.Date_of_birth.String(),
		Phone:         userInfo.Phone,
		Website:       userInfo.Website,
		Biography:     userInfo.Biography,
		IsBlocked:     user.IsBlocked,
	}
}

func userProfileSettingsResponse(user *interfaces.UserProfileSettings) map[string]interface{} {
	responseUser := &interfaces.UserProfileSettings{
		User_id:                            user.User_id,
		Private_profile:                    user.Private_profile,
		Accept_unfollowed_account_messages: user.Accept_unfollowed_account_messages,
		Tagging:                            user.Tagging,
		Muted_accounts:                     user.Muted_accounts,
		Blocked_accounts:                   user.Blocked_accounts,
		Followers:                          user.Followers,
		Following:                          user.Following,
		CloseFriends:                       user.CloseFriends,
	}
	var response = map[string]interface{}{"message": "all is fine"}
	response["data"] = responseUser
	response["muted"] = BlockedMutedParser(user.Muted_accounts)
	response["blocked"] = BlockedMutedParser(user.Blocked_accounts)
	response["followers"] = BlockedMutedParser(user.Followers)
	response["following"] = BlockedMutedParser(user.Following)
	response["closeFriends"] = BlockedMutedParser(user.CloseFriends)
	return response
}

func userNotificationResponse(user *interfaces.UserNotificationSettings) map[string]interface{} {
	responseUser := &interfaces.UserNotificationSettings{
		User_id:                  user.User_id,
		Likes:                    user.Likes,
		Comments:                 user.Comments,
		Accepted_follow_requests: user.Accepted_follow_requests,
		Posts:                    user.Posts,
		Stories:                  user.Stories,
		Messages:                 user.Messages,
	}
	var response = map[string]interface{}{"message": "all is fine"}
	response["data"] = responseUser
	return response
}

func MigrateInfo() {

	userX := &interfaces.UserInfo{}
	database.DB.AutoMigrate(&userX)

	userY := &interfaces.UserProfileSettings{}
	database.DB.AutoMigrate(&userY)

	userZ := &interfaces.UserNotificationSettings{}
	database.DB.AutoMigrate(&userZ)

	CheckForNewUsers()
	log.Info("Table initialization successful")
}

func CheckForNewUsers() {
	users := []interfaces.User{}
	database.DBP.Find(&users)

	for i := 0; i < len(users); i++ {
		user_info := &interfaces.UserInfo{User_id: users[i].ID}
		if database.DB.Where("user_id = ? ", users[i].ID).First(&user_info).RecordNotFound() {
			database.DB.Create(&user_info)
		}
		user_profile_settings := &interfaces.UserProfileSettings{User_id: users[i].ID}
		if database.DB.Where("user_id = ? ", users[i].ID).First(&user_profile_settings).RecordNotFound() {
			user_profile_settings.Private_profile = false
			user_profile_settings.Accept_unfollowed_account_messages = false
			user_profile_settings.Tagging = true
			database.DB.Create(&user_profile_settings)
		}
		user_notification_settings := &interfaces.UserNotificationSettings{User_id: users[i].ID}
		if database.DB.Where("user_id = ? ", users[i].ID).First(&user_notification_settings).RecordNotFound() {
			user_notification_settings.Likes = "from_everyone"
			user_notification_settings.Comments = "from_everyone"
			user_notification_settings.Accepted_follow_requests = "from_everyone"
			user_notification_settings.Posts = "from_people_i_follow"
			user_notification_settings.Stories = "off"
			user_notification_settings.Messages = "from_everyone"
			database.DB.Create(&user_notification_settings)
		}
	}
}

func EditUser(name string, surname string, username string, email string,
	user_id uint, gender string, date_of_birth string, phone string, website string, biography string) map[string]interface{} {

	CheckForNewUsers()
	dof, _ := time.Parse("2021-07-05 14:53:40.493946+00", date_of_birth)
	user_info := &interfaces.UserInfo{User_id: user_id, Gender: gender, Date_of_birth: dof, Phone: phone, Website: website, Biography: biography}
	if !(database.DB.Where("user_id = ? ", user_id).First(&user_info).RecordNotFound()) {
		user_info.Gender = gender
		user_info.Date_of_birth = dof
		user_info.Phone = phone
		user_info.Website = website
		user_info.Biography = biography

		database.DB.Save(&user_info)
	} else {
		//database.DB.Create(&user_info)
		return map[string]interface{}{"message": "cant edit non-existent user"}
	}

	user := &interfaces.User{First_name: name, Last_name: surname, Username: username, Email: email}
	if !(database.DBP.Where("id = ? ", user_id).First(&user).RecordNotFound()) {
		user.First_name = name
		user.Last_name = surname
		user.Username = username
		user.Email = email

		database.DBP.Save(&user)
	} else {
		//database.DB.Create(&user_info)
		return map[string]interface{}{"message": "cant edit non-existent user"}
	}

	var response = prepareResponse(user, true)

	return response
}

// Refactor GetUser function to use database package
func GetUser(id string, jwt string) map[string]interface{} {

	CheckForNewUsers()
	//isValid := helpers.ValidateToken(id, jwt)
	// Find and return user
	//if isValid {
	user := &interfaces.User{}
	if database.DBP.Where("id = ? ", id).First(&user).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	userInfo := &interfaces.UserInfo{}
	if database.DB.Where("user_id = ? ", id).First(&userInfo).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	var response = prepareFullResponse(user, userInfo, false)
	return response
	//} else {
	//return map[string]interface{}{"message": "Not valid token"}
	//}
}

func GetIdFromUsername(username string) uint {
	CheckForNewUsers()
	user := &interfaces.User{}
	if database.DBP.Where("username = ? ", username).First(&user).RecordNotFound() {
		return 0
	}
	return user.ID
}

func GetUsernameFromId(id uint) string {
	CheckForNewUsers()
	user := &interfaces.User{}
	if database.DBP.Where("id = ? ", id).First(&user).RecordNotFound() {
		return ""
	}
	return user.Username
}

func GetUsers(username string, id string) map[string]interface{} {
	CheckForNewUsers()
	var users []interfaces.User
	database.DBP.Where("username like '%" + username + "%' AND is_Blocked = false").Find(&users)
	blocked := GetBlockedProfiles(id)
	ret := []*interfaces.ResponseWholeUser{}
	for _, user := range users {
		userInfo := &interfaces.UserInfo{}
		if database.DB.Where("user_id = ? ", user.ID).First(&userInfo).RecordNotFound() {
			return nil
		}
		if !contains(blocked, int(user.ID)) {
			var usr = convertToResponseWholeUser(&user, userInfo)
			ret = append(ret, usr)
		}
	}
	var response = map[string]interface{}{"message": "all is fine"}
	response["data"] = ret
	return response
}

func GetTargetAudience(ageFrom int, ageTo int) []int {
	users := []interfaces.UserInfo{}
	database.DB.Where("(date_part('year', now()) - date_part('year', date_of_birth)) > ? and (date_part('year', now()) - date_part('year', date_of_birth)) < ?", ageFrom, ageTo).Find(&users)

	ret := []int{}
	for _, user := range users {
		ret = append(ret, int(user.User_id))
	}

	return ret
}

func contains(s []int, str int) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}
	return false
}

func EditUserProfile(user_id uint, is_private bool, accept_messages bool, tagging bool) map[string]interface{} {

	CheckForNewUsers()

	user_profile_settings := &interfaces.UserProfileSettings{}
	if !(database.DB.Where("user_id = ? ", user_id).First(&user_profile_settings).RecordNotFound()) {
		user_profile_settings.Private_profile = is_private
		user_profile_settings.Accept_unfollowed_account_messages = accept_messages
		user_profile_settings.Tagging = tagging
		//user_profile_settings.Muted_accounts = muted_accs
		//user_profile_settings.Blocked_accounts = blocked_accs

		database.DB.Save(&user_profile_settings)
	} else {
		//database.DB.Create(&user_info)
		return map[string]interface{}{"message": "cant edit user profile of non-existent user"}
	}

	user := &interfaces.User{}
	if database.DBP.Where("id = ? ", user_id).First(&user).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	var response = prepareResponse(user, false)
	return response
}

func GetMutedAccounts(user_id string) []int {

	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}

	if database.DB.Where("user_id = ? ", user_id).First(&user_profile_settings).RecordNotFound() {
		return []int{}
	}

	return BlockedMutedParser(user_profile_settings.Muted_accounts)
}

func GetBlockedAccounts(user_id string) []int {

	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}

	if database.DB.Where("user_id = ? ", user_id).First(&user_profile_settings).RecordNotFound() {
		return []int{}
	}

	return BlockedMutedParser(user_profile_settings.Blocked_accounts)
}

func GetPublicAccounts() []int {
	CheckForNewUsers()

	users := []interfaces.UserProfileSettings{}
	database.DB.Where("private_profile = false").Find(&users)

	ret := []int{}
	for _, user := range users {
		ret = append(ret, int(user.User_id))
	}

	return ret
}

func GetUserProfileSettings(user_id string) map[string]interface{} {

	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}

	if database.DB.Where("user_id = ? ", user_id).First(&user_profile_settings).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	var response = userProfileSettingsResponse(user_profile_settings)
	return response
}

func IsUserTaggable(user_id uint) bool {
	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}
	if database.DB.Where("user_id = ? ", user_id).First(&user_profile_settings).RecordNotFound() {
		return false
	}
	return user_profile_settings.Tagging
}

func FilterUsers(criteria string) []interfaces.UserDto {
	CheckForNewUsers()

	users := []interfaces.User{}
	database.DBP.Where("lower(username) like lower(?)", "%"+criteria+"%").Find(&users)

	ret := []interfaces.UserDto{}
	for _, user := range users {
		profilePic := GetUserProfilePic(user.ID)
		ret = append(ret, interfaces.UserDto{
			ID:             user.ID,
			Username:       user.Username,
			UserProfilePic: profilePic,
		})
	}
	return ret
}

func GetUserProfilePic(user_id uint) string {
	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}
	if database.DB.Where("user_id = ? ", user_id).First(&user_profile_settings).RecordNotFound() {
		return ""
	}
	return user_profile_settings.UserProfilePic
}

func GetBlockedProfiles(user_id string) []int {

	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}

	if database.DB.Where("user_id = ? ", user_id).First(&user_profile_settings).RecordNotFound() {
		return []int{}
	}

	var response = BlockedMutedParser(user_profile_settings.Blocked_accounts)
	return response
}

func BlockedMutedParser(cell string) []int {
	//var num_ids []int
	if cell != "" {
		ids := strings.Split(cell, ";")
		num_ids := make([]int, len(ids))
		for i, id := range ids {
			num, _ := strconv.Atoi(id)
			num_ids[i] = num
		}
		return num_ids
	}
	return nil
}

func UserMuteBlockOption(option string, user_id uint, muted_blocked_username string /*muted_acc string, blocked_acc string*/) map[string]interface{} {

	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}
	user_main := &interfaces.User{}

	if database.DBP.Where("username = ? ", muted_blocked_username).First(&user_main).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}
	muted_acc := strconv.Itoa(int(user_main.ID))
	blocked_acc := strconv.Itoa(int(user_main.ID))

	if database.DB.Where("user_id = ? ", user_id).First(&user_profile_settings).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	temp_muted := user_profile_settings.Muted_accounts
	temp_blocked := user_profile_settings.Blocked_accounts

	ids_muted := strings.Split(temp_muted, ";")
	ids_blocked := strings.Split(temp_blocked, ";")

	if option == "mute" {
		var new_muted string
		if temp_muted == "" {
			new_muted = muted_acc
		} else {
			new_muted = temp_muted + ";" + muted_acc
		}
		user_profile_settings.Muted_accounts = new_muted
	} else if option == "block" {
		var new_blocked string
		if temp_blocked == "" {
			new_blocked = blocked_acc
		} else {
			new_blocked = temp_blocked + ";" + blocked_acc
		}
		user_profile_settings.Blocked_accounts = new_blocked
	} else if option == "unmute" {
		var new_muted string
		for i, id := range ids_muted {
			if id != muted_acc {
				new_muted += id + ";"
			} else {
				i = i * 1
			}
		}
		if strings.HasSuffix(new_muted, ";") {
			new_muted = new_muted[:len(new_muted)-len(";")]
		}
		user_profile_settings.Muted_accounts = new_muted
	} else if option == "unblock" {
		var new_blocked string
		for i, id := range ids_blocked {
			if id != blocked_acc {
				new_blocked += id + ";"
			} else {
				i = i * 1
			}
		}
		if strings.HasSuffix(new_blocked, ";") {
			new_blocked = new_blocked[:len(new_blocked)-len(";")]
		}
		user_profile_settings.Blocked_accounts = new_blocked
	} else {
		return map[string]interface{}{"message": "Option is not valid"}
	}

	database.DB.Save(&user_profile_settings)

	var response = userProfileSettingsResponse(user_profile_settings)
	return response
}

func EditUserNotification(user_id uint, likes string, comments string, accepted_follow_requests string,
	posts string, stories string, messages string) map[string]interface{} {

	CheckForNewUsers()

	user_notification_settings := &interfaces.UserNotificationSettings{}
	if !(database.DB.Where("user_id = ? ", user_id).First(&user_notification_settings).RecordNotFound()) {
		user_notification_settings.Likes = likes
		user_notification_settings.Comments = comments
		user_notification_settings.Accepted_follow_requests = accepted_follow_requests
		user_notification_settings.Posts = posts
		user_notification_settings.Stories = stories
		user_notification_settings.Messages = messages

		database.DB.Save(&user_notification_settings)
	} else {
		//database.DB.Create(&user_info)
		return map[string]interface{}{"message": "cant edit user profile of non-existent user"}
	}

	user := &interfaces.User{}
	if database.DBP.Where("id = ? ", user_id).First(&user).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	var response = prepareResponse(user, false)
	return response
}

func GetUserNotificationSettings(user_id string) map[string]interface{} {

	CheckForNewUsers()
	user_notification_settings := &interfaces.UserNotificationSettings{}

	if database.DB.Where("user_id = ? ", user_id).First(&user_notification_settings).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	var response = userNotificationResponse(user_notification_settings)
	return response
}

func GetFollowers(user_id string) []int {
	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}

	if database.DB.Where("user_id = ?", user_id).First(&user_profile_settings).RecordNotFound() {
		return []int{}
	}

	var response = BlockedMutedParser(user_profile_settings.Followers)
	return response
}

func GetFollowing(user_id string) []int {
	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}

	if database.DB.Where("user_id = ?", user_id).First(&user_profile_settings).RecordNotFound() {
		return []int{}
	}

	var response = BlockedMutedParser(user_profile_settings.Following)
	return response
}

func GetCloseFriends(user_id string) []int {
	CheckForNewUsers()

	user_profile_settings := &interfaces.UserProfileSettings{}

	if database.DB.Where("user_id = ?", user_id).First(&user_profile_settings).RecordNotFound() {
		return []int{}
	}

	var response = BlockedMutedParser(user_profile_settings.CloseFriends)
	return response
}

func Follow(user_id uint, username string) map[string]interface{} {
	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}
	user_profile_settings2 := &interfaces.UserProfileSettings{}
	user_main := &interfaces.User{}

	if database.DBP.Where("username = ? ", username).First(&user_main).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	userToFollow := strconv.Itoa(int(user_main.ID))

	if database.DB.Where("user_id = ? ", user_id).First(&user_profile_settings).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	temp_following := user_profile_settings.Following

	var new_following string

	if temp_following == "" {
		new_following = userToFollow
	} else {
		new_following = temp_following + ";" + userToFollow
	}
	user_profile_settings.Following = new_following

	database.DB.Save(&user_profile_settings)

	if database.DB.Where("user_id = ? ", user_main.ID).First(&user_profile_settings2).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	temp_followers := user_profile_settings2.Followers

	userFollower := strconv.Itoa(int(user_id))
	var new_followers string

	if temp_followers == "" {
		new_followers = userFollower
	} else {
		new_followers = temp_followers + ";" + userFollower
	}
	user_profile_settings2.Following = new_followers

	database.DB.Save(user_profile_settings2)

	var response = userProfileSettingsResponse(user_profile_settings)
	return response
}

func Unfollow(user_id uint, username string) map[string]interface{} {
	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}
	user_profile_settings2 := &interfaces.UserProfileSettings{}
	user_main := &interfaces.User{}

	if database.DBP.Where("username = ? ", username).First(&user_main).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	userToUnfollow := strconv.Itoa(int(user_main.ID))

	if database.DB.Where("user_id = ? ", user_id).First(&user_profile_settings).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	temp_following := user_profile_settings.Following
	ids_following := strings.Split(temp_following, ";")

	var new_following string

	for _, id := range ids_following {
		if id != userToUnfollow {
			new_following += id + ";"
		}
	}
	if strings.HasSuffix(new_following, ";") {
		new_following = new_following[:len(new_following)-len(";")]
	}
	user_profile_settings.Following = new_following

	database.DB.Save(&user_profile_settings)

	if database.DB.Where("user_id = ? ", user_main.ID).First(&user_profile_settings2).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	temp_followers := user_profile_settings2.Followers
	ids_followers := strings.Split(temp_followers, ";")

	userFollower := strconv.Itoa(int(user_id))
	var new_followers string

	for _, id := range ids_followers {
		if id != userFollower {
			new_followers += id + ";"
		}
	}
	if strings.HasSuffix(new_followers, ";") {
		new_followers = new_followers[:len(new_followers)-len(";")]
	}

	user_profile_settings2.Followers = new_followers

	database.DB.Save(&user_profile_settings2)

	var response = userProfileSettingsResponse(user_profile_settings)
	return response
}

func AddToCloseFriends(user_id uint, username string) map[string]interface{} {
	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}
	user_main := &interfaces.User{}

	if database.DBP.Where("username = ? ", username).First(&user_main).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	userToAdd := strconv.Itoa(int(user_main.ID))

	if database.DB.Where("user_id = ? ", user_id).First(&user_profile_settings).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	temp_closeFriends := user_profile_settings.CloseFriends

	var new_closeFriends string

	if temp_closeFriends == "" {
		new_closeFriends = userToAdd
	} else {
		new_closeFriends = temp_closeFriends + ";" + userToAdd
	}
	user_profile_settings.CloseFriends = new_closeFriends

	database.DB.Save(&user_profile_settings)

	var response = userProfileSettingsResponse(user_profile_settings)
	return response
}

func RemoveFromCloseFriends(user_id uint, username string) map[string]interface{} {
	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}
	user_main := &interfaces.User{}

	if database.DBP.Where("username = ? ", username).First(&user_main).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	userToRemove := strconv.Itoa(int(user_main.ID))

	if database.DB.Where("user_id = ? ", user_id).First(&user_profile_settings).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	temp_closeFriends := user_profile_settings.CloseFriends
	ids_closeFriends := strings.Split(temp_closeFriends, ";")

	var new_closeFriends string

	for _, id := range ids_closeFriends {
		if id != userToRemove {
			new_closeFriends += id + ";"
		}
	}
	if strings.HasSuffix(new_closeFriends, ";") {
		new_closeFriends = new_closeFriends[:len(new_closeFriends)-len(";")]
	}
	user_profile_settings.CloseFriends = new_closeFriends

	database.DB.Save(&user_profile_settings)
	return map[string]interface{}{"message": "Ok"}
}
