package main

import "time"

type RequestPost struct {
	Username    string    `json:"username"`
	LocationID  int       `json:"location_id"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	Hashtags    []string  `json:"hashtags"`
	Tags        []string  `json:"tags"`
	ImageUrls   []string  `json:"imageUrls"`
}

type RequestStory struct {
	Username         string    `json:"username"`
	LocationID       int       `json:"location_id"`
	Description      string    `json:"description"`
	CreatedAt        time.Time `json:"createdAt"`
	Hashtags         []string  `json:"hashtags"`
	Tags             []string  `json:"tags"`
	ImageUrls        []string  `json:"imageUrls"`
	OnlyCloseFriends bool      `json:"onlyCloseFriends"`
}

type RequestComment struct {
	Content  string `json:"content"`
	Username string `json:"username"`
	PostID   int    `json:"postId"`
}

type RequestRatePost struct {
	Username string `json:"username"`
	PostID   int    `json:"postId"`
}

type ResponseId struct {
	Id int `json:"id"`
}

type RequestSetStoryHighlight struct {
	StoryID     int  `json:"storyId"`
	IsHighlight bool `json:"isHighlight"`
}
