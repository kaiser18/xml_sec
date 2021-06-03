package users

import (
	"time"
	"fmt"

	"back_go/auth_service/registration2/database"
	"back_go/auth_service/registration2/helpers"
	"back_go/auth_service/registration2/interfaces"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
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

// Refactor Login function to use database package
func Login(username string, pass string) map[string]interface{} {
	// Add validation to login
	valid := helpers.Validation(
		[]interfaces.Validation{
			{Value: username, Valid: "username"},
			{Value: pass, Valid: "password"},
		})
	if valid {
		user := &interfaces.User{}
		if database.DB.Where("username = ? ", username).First(&user).RecordNotFound() {
			return map[string]interface{}{"message": "User not found"}
		}
		// Verify password
		passErr := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(pass))

		if passErr == bcrypt.ErrMismatchedHashAndPassword && passErr != nil {
			return map[string]interface{}{"message": "Wrong password"}
		}

		users := []interfaces.ResponseUser{}
		database.DB.Table("users").Select("id, username, name, surname").Where("user_id = ? ", user.ID).Scan(&users)


		var response = prepareResponse(user, true);

		return response
	} else {
		return map[string]interface{}{"message": "not valid values"}
	}
}

// Refactor Register function to use database package
func Register(name string, surname string, username string, email string, pass string) map[string]interface{} {
	// Add validation to registration
	valid := helpers.Validation(
		[]interfaces.Validation{
			{Value: name, Valid: "name"},
			{Value: surname, Valid: "surname"},
			{Value: username, Valid: "username"},
			{Value: email, Valid: "email"},
			{Value: pass, Valid: "password"},
		})
	if valid {
		userX := &interfaces.User{}
		if !(database.DB.Where("username = ? ", username).First(&userX).RecordNotFound()) {
			return map[string]interface{}{"message": "The username already exists"}
		}

		if !(database.DB.Where("email = ? ", email).First(&userX).RecordNotFound()) {
			return map[string]interface{}{"message": "Email already in use"}
		}

		generatedPassword := helpers.HashAndSalt([]byte(pass))
		user := &interfaces.User{Name: name, Surname: surname, Username: username, Email: email, Password: generatedPassword}
		fmt.Println("&user")
		fmt.Println(&user)
		fmt.Println("&user")
		database.DB.Create(&user)

		var response = prepareResponse(user, true)

		return response
	} else {
		return map[string]interface{}{"message": "not valid values"}
	}

}

// Refactor GetUser function to use database package
func GetUser(id string, jwt string) map[string]interface{} {
	isValid := helpers.ValidateToken(id, jwt)
	// Find and return user
	if isValid {
		user := &interfaces.User{}
		if database.DB.Where("id = ? ", id).First(&user).RecordNotFound() {
			return map[string]interface{}{"message": "User not found"}
		}

		var response = prepareResponse(user, false);
		return response
	} else {
		return map[string]interface{}{"message": "Not valid token"}
	 }
}
