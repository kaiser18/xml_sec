package migrations

import (
	"back_go/auth_service/registration/helpers"
	"back_go/auth_service/registration/interfaces"

	_ "github.com/jinzhu/gorm/dialects/postgres"
)

func createAccounts() {
	db := helpers.ConnectDB()

	users := &[2]interfaces.User{
		{Name: "Vin", Surname: "Diesel", Username: "furious.vin", Email: "vin.diesel@hotmail.com"},
		{Name: "Jason", Surname: "Statham", Username: "transport.me", Email: "transporter@yahoo.com"},
	}

	for i := 0; i < len(users); i++ {
		// Correct one way
		generatedPassword := helpers.HashAndSalt([]byte(users[i].Username))
		user := &interfaces.User{Name: users[i].Name, Surname: users[i].Surname, Username: users[i].Username, Email: users[i].Email, Password: generatedPassword}
		db.Create(&user)

	}
	defer db.Close()
}


func Migrate() {
	User := &interfaces.User{}
	db := helpers.ConnectDB()
	db.AutoMigrate(&User)
	defer db.Close()

	createAccounts()
}
