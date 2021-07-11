package poststore

import "time"

type Post struct {
	ID          int         `json:"id"`
	Username    string      `json:"username"`
	LocationID  int         `json:"location_id"`
	Location    Location    `json:"location"`
	Description string      `json:"description"`
	CreatedAt   time.Time   `gorm:"type:time" json:"createdAt"`
	Tags        []Username  `gorm:"many2many:post_tag;" json:"tags"`
	Hashtags    []Hashtag   `gorm:"many2many:post_hashtag;" json:"hashtags"`
	ImageUrls   []ImagePath `gorm:"many2many:post_image;" json:"imageUrls"`
	Likes       []Username  `gorm:"many2many:post_like;" json:"likes"`
	Dislikes    []Username  `gorm:"many2many:post_dislike;" json:"dislikes"`
	Comments    []Comment   `gorm:"polymorphic:Owner;" json:"comments"`
}

type SavedPost struct {
	ID         int               `json:"id"`
	Username   string            `json:"username"`
	CategoryID int               `json:"category_id"`
	Category   SavedPostCategory `json:"category"`
	PostID     int               `json:"post_id"`
}

type SavedPostCategory struct {
	ID           int    `json:"id"`
	Username     string `json:"username"`
	CategoryName string `json:"category_name"`
}

type Story struct {
	ID               int         `json:"id"`
	Username         string      `json:"username"`
	LocationID       int         `json:"location_id"`
	Location         Location    `json:"location"`
	Description      string      `json:"description"`
	CreatedAt        time.Time   `gorm:"type:time" json:"createdAt"`
	Tags             []Username  `gorm:"many2many:story_tag;" json:"tags"`
	Hashtags         []Hashtag   `gorm:"many2many:story_hashtag;" json:"hashtags"`
	ImageUrls        []ImagePath `gorm:"many2many:story_image;" json:"imageUrls"`
	OnlyCloseFriends bool        `json:"onlyCloseFriends"`
	IsHighlight      bool        `json:"isHighlight"`
}

type Comment struct {
	ID        int    `json:"id"`
	Content   string `json:"content"`
	Username  string `json:"username"`
	OwnerID   int
	OwnerType string
}

type Hashtag struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Location struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type ImagePath struct {
	ID   int    `json:"id"`
	Path string `json:"path"`
}

type Username struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
