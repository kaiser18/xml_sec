package interfaces

import "github.com/jinzhu/gorm"

type User struct {
	gorm.Model
	Name string
	Surname string
    Username string
	Email string
	Password string
}

type ResponseUser struct {
	ID uint
	Username string
	Email string
	//Accounts []ResponseAccount
}

// Create Validation interface
type Validation struct {
	Value string
	Valid string
}
