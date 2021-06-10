package searchstore

import "time"

type PostInfo struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	PostID    int       `json:"post_id"`
	CreatedAt time.Time `gorm:"type:time" json:"createdAt"`
}

type StoryInfo struct {
	ID               int       `json:"id"`
	Username         string    `json:"username"`
	PostID           int       `json:"post_id"`
	CreatedAt        time.Time `gorm:"type:time" json:"createdAt"`
	OnlyCloseFriends bool      `json:"onlyCloseFriends"`
	IsHighlight      bool      `json:"isHighlight"`
}
