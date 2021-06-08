package users

import (
	"time"
	//"fmt"

	"back_go/user_service/database"
	"back_go/user_service/helpers"
	"back_go/user_service/interfaces"
	"github.com/dgrijalva/jwt-go"
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
		Name: user.Name,
		Surname: user.Surname,
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


func MigrateInfo() {

    userX := &interfaces.UserInfo{}
    database.DB.AutoMigrate(&userX)
}

func CheckForNewUsers() {
	users := []interfaces.User{}
	database.DB.Find(&users)

	for i := 0; i < len(users); i++ {
		user_info := &interfaces.UserInfo{User_id: users[i].ID}
		if database.DB.Where("user_id = ? ", users[i].ID).First(&user_info).RecordNotFound() {
        	database.DB.Create(&user_info)
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

	user := &interfaces.User{Name: name, Surname: surname, Username: username, Email: email}
	if !(database.DB.Where("id = ? ", user_id).First(&user).RecordNotFound()) {
		user.Name = name
		user.Surname = surname
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
