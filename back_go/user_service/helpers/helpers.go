package helpers

import (
	"encoding/json"
	//"log"
	"net/http"
	//"regexp"
	"strconv"
	"strings"

	"back_go/user_service/interfaces"

	"github.com/dgrijalva/jwt-go"
	_ "github.com/lib/pq"
	log "github.com/sirupsen/logrus"
	//"path/filepath"
)

func HandleErr(err error) {
	if err != nil {
		log.Error(err)
		panic(err.Error())
	}
}

// Create panic handler
func PanicHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			error := recover()
			if error != nil {
				//log.Println(error)
				log.WithFields(log.Fields{
					"method":            r.Method,
					"path":              r.URL,
					"agent":             r.UserAgent(),
					"response":          r.Response,
					"host":              r.Host,
					"proto":             r.Proto,
					"error_description": error,
					"service":           "user_service",
				}).Error("request details")

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

func Contains(s []int, e int) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
