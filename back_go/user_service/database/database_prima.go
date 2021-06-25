package database

import (
	"back_go/user_service/helpers"

	"github.com/jinzhu/gorm"
	_ "github.com/lib/pq"
)

// Create global variable
var DBP *gorm.DB

// Create InitDatabase function
func InitDatabasePrima() {

	database, err := gorm.Open("postgres", "host=db port=5432 user=postgres dbname=bezbednost password=postgres sslmode=disable")
	//database, err := gorm.Open("postgres", "host=127.0.0.1 port=5432 user=postgres dbname=mrdocker password=petarpanizvoncica sslmode=disable")

	helpers.HandleErr(err)
	// Set up connection pool
	database.DB().SetMaxIdleConns(30)
	database.DB().SetMaxOpenConns(200)
	DBP = database
}
