package migrations

import (
	"fmt"
	"back_go/auth_service/registration2/database"
	"back_go/auth_service/registration2/interfaces"

	_ "github.com/jinzhu/gorm/dialects/postgres"
)


func Migrate() {

	User := &interfaces.User{}
	database.DB.AutoMigrate(&User)

	fmt.Println("Migration completed")
}
