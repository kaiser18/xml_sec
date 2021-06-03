package helpers

import (
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"back_go/auth_service/registration2/interfaces"
	"github.com/dgrijalva/jwt-go"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)


func HandleErr(err error) {
	if err != nil {
		panic(err.Error())
	}
}

func HashAndSalt(pass []byte) string {
	hashed, err := bcrypt.GenerateFromPassword(pass, bcrypt.MinCost)
	HandleErr(err)

	return string(hashed)
}

// Delete ConnectDB from helpers

// Create validation
func Validation(values []interfaces.Validation) bool{
	username_regexp := `^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$`
	//email_regexp := `^(?:[a-z0-9!#$%&'*+/=?^_`+`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`+`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$`
	email_regexp := `^(?:[a-z0-9!#$%&'*+/=?^_`+`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`+`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$`

	username := regexp.MustCompile(username_regexp)
	email := regexp.MustCompile(email_regexp)

	for i := 0; i < len(values); i++ {
		switch values[i].Valid {
			case "username":
				if !username.MatchString(values[i].Value) {
					return false
				}
			case "email":
				if !email.MatchString(values[i].Value) {
					return false
				}
			case "password":
				if len(values[i].Value) < 5 {
					return false
				}

		}
	}
	return true
}


// Create panic handler
func PanicHandler(next http.Handler) http.Handler{
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			error := recover()
			if error != nil {
				log.Println(error)

				resp := interfaces.ErrResponse{Message: "Internal server error"}
				json.NewEncoder(w).Encode(resp)
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func ValidateToken(id string, jwtToken string) bool {
	cleanJWT := strings.Replace(jwtToken, "Bearer ", "", -1)
	tokenData := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(cleanJWT, tokenData, func(token *jwt.Token) (interface{}, error) {
			return []byte("TokenPassword"), nil
	})
	HandleErr(err)
	var userId, _ = strconv.ParseFloat(id, 8)
	if token.Valid && tokenData["user_id"] == userId {
		return true
	} else {
		return false
	}
}
