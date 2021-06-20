package users

import (
	"time"
	//"fmt"
	"strings"
	"strconv"

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
		"expiry": time.Now().Add(time.Minute * 60).Unix(),
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
		Email: user.Email,
	}
	var response = map[string]interface{}{"message": "all is fine"}
	// Add withToken feature to prepare response
	if withToken {
		var token = prepareToken(user);
		response["jwt"] = token
	}
	response["data"] = responseUser
	return response
}

func prepareFullResponse(user *interfaces.User, userInfo *interfaces.UserInfo, withToken bool) map[string]interface{} {
	responseUser := &interfaces.ResponseWholeUser{
		ID: user.ID,
		Name: user.First_name,
		Surname: user.Last_name,
		Username: user.Username,
		Email: user.Email,
		Gender: userInfo.Gender,
		Date_of_birth: userInfo.Date_of_birth,
		Phone: userInfo.Phone,
		Website: userInfo.Website,
		Biography: userInfo.Biography,
	}
	var response = map[string]interface{}{"message": "all is fine"}
	// Add withToken feature to prepare response
	if withToken {
		var token = prepareToken(user);
		response["jwt"] = token
	}
	response["data"] = responseUser
	return response
}

func userProfileSettingsResponse(user *interfaces.UserProfileSettings) map[string]interface{} {
	responseUser := &interfaces.UserProfileSettings{
		User_id: user.User_id,
		Private_profile: user.Private_profile,
		Accept_unfollowed_account_messages: user.Accept_unfollowed_account_messages,
		Tagging: user.Tagging,
		Muted_accounts: user.Muted_accounts,
		Blocked_accounts: user.Blocked_accounts,

	}
	var response = map[string]interface{}{"message": "all is fine"}
	response["data"] = responseUser
	response["muted"] = BlockedMutedParser(user.Muted_accounts)
	response["blocked"] = BlockedMutedParser(user.Blocked_accounts)
	return response
}

func userNotificationResponse(user *interfaces.UserNotificationSettings) map[string]interface{} {
	responseUser := &interfaces.UserNotificationSettings{
		User_id: user.User_id,
		Likes: user.Likes,
		Comments: user.Comments,
		Accepted_follow_requests: user.Accepted_follow_requests,
		Posts: user.Posts,
		Stories: user.Stories,
		Messages: user.Messages,

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
	database.DB.Find(&users)

	for i := 0; i < len(users); i++ {
		user_info := &interfaces.UserInfo{User_id: users[i].ID}
		if database.DB.Where("user_id = ? ", users[i].ID).First(&user_info).RecordNotFound() {
        	database.DB.Create(&user_info)
		}
		user_profile_settings := &interfaces.UserProfileSettings{User_id: users[i].ID}
		if database.DB.Where("user_id = ? ", users[i].ID).First(&user_profile_settings).RecordNotFound() {
        	database.DB.Create(&user_profile_settings)
		}
		user_notification_settings := &interfaces.UserNotificationSettings{User_id: users[i].ID}
		if database.DB.Where("user_id = ? ", users[i].ID).First(&user_notification_settings).RecordNotFound() {
        	database.DB.Create(&user_notification_settings)
		}
    }
}

func EditUser(name string, surname string, username string, email string,
     user_id uint, gender string, date_of_birth string, phone string, website string, biography string) map [string]interface{} {

	CheckForNewUsers()

    user_info := &interfaces.UserInfo{User_id: user_id, Gender: gender, Date_of_birth: date_of_birth, Phone: phone, Website: website, Biography: biography}
	if !(database.DB.Where("user_id = ? ", user_id).First(&user_info).RecordNotFound()) {
		user_info.Gender = gender
		user_info.Date_of_birth = date_of_birth
		user_info.Phone = phone
		user_info.Website = website
		user_info.Biography = biography

		database.DB.Save(&user_info)
	} else {
		//database.DB.Create(&user_info)
		return map[string]interface{}{"message": "cant edit non-existent user"}
	}

	user := &interfaces.User{First_name: name, Last_name: surname, Username: username, Email: email}
	if !(database.DB.Where("id = ? ", user_id).First(&user).RecordNotFound()) {
		user.First_name = name
		user.Last_name = surname
		user.Username = username
		user.Email = email

		database.DB.Save(&user)
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
		if database.DB.Where("id = ? ", id).First(&user).RecordNotFound() {
			return map[string]interface{}{"message": "User not found"}
		}

		userInfo := &interfaces.UserInfo{}
		if database.DB.Where("user_id = ? ", id).First(&userInfo).RecordNotFound() {
			return map[string]interface{}{"message": "User not found"}
		}

		var response = prepareFullResponse(user, userInfo, false);
		return response
	//} else {
		//return map[string]interface{}{"message": "Not valid token"}
	 //}
}

func EditUserProfile(user_id uint, is_private bool, accept_messages bool, tagging bool, muted_accs string, blocked_accs string) map [string]interface{} {

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
	if database.DB.Where("id = ? ",user_id).First(&user).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}

	var response = prepareResponse(user, false)
	return response
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

func UserMuteBlockOption(option string, username string, muted_acc string, blocked_acc string) map[string]interface{} {

	CheckForNewUsers()
	user_profile_settings := &interfaces.UserProfileSettings{}
	user_main := &interfaces.User{}

	if database.DB.Where("username = ? ", username).First(&user_main).RecordNotFound() {
		return map[string]interface{}{"message": "User not found"}
	}
	user_id := user_main.ID

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
				i = i*1
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
				i = i*1
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
	 posts string, stories string, messages string) map [string]interface{} {

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
	if database.DB.Where("id = ? ",user_id).First(&user).RecordNotFound() {
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
