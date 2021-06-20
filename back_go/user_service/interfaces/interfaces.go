package interfaces

import "github.com/jinzhu/gorm"

type User struct {
	//gorm.Model
	ID         uint
	First_name string
	Last_name  string
	Username   string
	Email      string
	Password   string
}

type ResponseUser struct {
	ID       uint
	Username string
	Email    string
}

type ResponseWholeUser struct {
	ID            uint
	Name          string
	Surname       string
	Username      string
	Email         string
	Gender        string
	Date_of_birth string
	Phone         string
	Website       string
	Biography     string
}

type UserInfo struct {
	gorm.Model
	User_id       uint
	Gender        string
	Date_of_birth string
	Phone         string
	Website       string
	Biography     string
}

type UserProfileSettings struct {
	ID uint
	User_id uint
	Private_profile bool
	Accept_unfollowed_account_messages bool
	Tagging bool
	Muted_accounts string
	Blocked_accounts string
}

type UserNotificationSettings struct {
	ID uint
	User_id uint
	Likes string
	Comments string
	Accepted_follow_requests string
	Posts string
	Stories string
	Messages string
}

// Create Validation interface
type Validation struct {
	Value string
	Valid string
}

type ErrResponse struct {
	Message string
}
