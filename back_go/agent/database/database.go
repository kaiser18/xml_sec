package database

import (

    "os"
    "fmt"
    "gorm.io/gorm"
    "gorm.io/driver/postgres"
    "back_go/agent/interfaces"
	_ "github.com/lib/pq"
)

// Create global variable
var DB *gorm.DB

// Create InitDatabase function
func InitDatabase() {

	host := os.Getenv("DBHOST")
	user := os.Getenv("USER")
	password := os.Getenv("PASSWORD")
	dbname := os.Getenv("DBNAME")
	dbport := os.Getenv("DBPORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", host, user, password, dbname, dbport)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err.Error())
	}
    DB = db
    MigrateInfo()
}

func MigrateInfo() *gorm.DB {
    var err error

    err = DB.AutoMigrate(&interfaces.Privilege{})
	if err != nil {
		return nil
	}
    table_privilages := &interfaces.Privilege{}
    table_privilages.ID = 1
    table_privilages.Name = "CREATE_PRODUCT"
    DB.Create(&table_privilages)
    table_privilages.ID = 2
    table_privilages.Name = "DELETE_PRODUCT"
    DB.Create(&table_privilages)
    table_privilages.ID = 3
    table_privilages.Name = "UPDATE_PRODUCT"
    DB.Create(&table_privilages)
    table_privilages.ID = 4
    table_privilages.Name = "CREATE_ORDER"
    DB.Create(&table_privilages)
    table_privilages.ID = 5
    table_privilages.Name = "CREATE_TOKEN"
    DB.Create(&table_privilages)

	err = DB.AutoMigrate(&interfaces.Role{})
	if err != nil {
		return nil
	}
    table_roles := &interfaces.Role{}
    table_roles.ID = 1
    table_roles.Name = "CUSTOMER"
    DB.Create(&table_roles)
    table_roles.ID = 2
    table_roles.Name = "AGENT"
    DB.Create(&table_roles)

	err = DB.AutoMigrate(&interfaces.User{})
	if err != nil {
		return nil
	}

	err = DB.AutoMigrate(&interfaces.Product{})
	if err != nil {
		return nil
	}

	err = DB.AutoMigrate(&interfaces.AgentProduct{})
	if err != nil {
		return nil
	}

	err = DB.AutoMigrate(&interfaces.Item{})
	if err != nil {
		return nil
	}

	err = DB.AutoMigrate(&interfaces.Order{})
	if err != nil {
		return nil
	}
    return DB
}
