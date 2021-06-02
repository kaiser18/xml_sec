package api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"back_go/auth_service/registration/helpers"
	"back_go/auth_service/registration/users"

	"github.com/gorilla/mux"
)


type Register struct {
	Name string
	Surname string
	Username string
	Email string
	Password string
}

type ErrResponse struct {
	Message string
}

func register(w http.ResponseWriter, r *http.Request) {
	// Read body
	body, err := ioutil.ReadAll(r.Body)
	helpers.HandleErr(err)
	// Handle registration
	var formattedBody Register
	err = json.Unmarshal(body, &formattedBody)
	log.Println(formattedBody)
	helpers.HandleErr(err)
	register := users.Register(formattedBody.Name, formattedBody.Surname, formattedBody.Username, formattedBody.Email, formattedBody.Password)
	// Prepare response
	log.Println(register)
	if register["message"] == "all is fine" {
		resp := register
		json.NewEncoder(w).Encode(resp)
		// Handle error in else
	} else {
		resp := ErrResponse{Message: "Wrong username or password"}
		json.NewEncoder(w).Encode(resp)
	}
}

func StartApi() {
	port_used := ":8081"
	router := mux.NewRouter()
	router.HandleFunc("/register", register).Methods("POST")
	fmt.Println("App is working on port " + port_used)
	log.Fatal(http.ListenAndServe(port_used, router))

}
