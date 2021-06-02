package users

import (
	"time"

	"back_go/auth_service/registration/helpers"
	"back_go/auth_service/registration/interfaces"

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
func prepareResponse(user *interfaces.User) map[string]interface{} {
	responseUser := &interfaces.ResponseUser{
		ID: user.ID,
		//Name: user.Name,
		//Surname: user.Surname,
		Username: user.Username,
		Email: user.Email,
	}

	var token = prepareToken(user);
	var response = map[string]interface{}{"message": "all is fine"}
	response["jwt"] = token
	response["data"] = responseUser

	return response
}

// Create registration function
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
		// Create registration logic
		// Connect DB
		db := helpers.ConnectDB()
		generatedPassword := helpers.HashAndSalt([]byte(pass))
		user := &interfaces.User{Name: name, Surname: surname, Username: username, Email: email, Password: generatedPassword}
		db.Create(&user)

		defer db.Close()
		var response = prepareResponse(user)

		return response
	} else {
		return map[string]interface{}{"message": "not valid values"}
	}

}
