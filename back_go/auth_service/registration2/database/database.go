package database

import (
    "back_go/auth_service/registration2/helpers"
	"github.com/jinzhu/gorm"

    // "gorm.io/gorm"
    // "gorm.io/driver/postgres"
    _ "github.com/lib/pq"
)

// Create global variable
var DB *gorm.DB

// Create InitDatabase function
func InitDatabase() {

    //database, err := gorm.Open("postgres", "host=db port=5432 user=postgres dbname=users password=postgres sslmode=disable")
    database, err := gorm.Open("postgres", "host=127.0.0.1 port=5432 user=postgres dbname=mrdocker password=petarpanizvoncica sslmode=disable")

	helpers.HandleErr(err)
	// Set up connection pool
	database.DB().SetMaxIdleConns(20)
	database.DB().SetMaxOpenConns(200)
	DB = database
}
