package main

import "time"

type Report struct {
	Id               int       `json:"id"`
	ReporterUsername string    `json:"reporterUsername"`
	Username         string    `json:"username"`
	UserProfilePic   string    `json:"userProfilePic"`
	LocationName     string    `json:"location_name"`
	Description      string    `json:"description"`
	CreatedAt        time.Time `json:"createdAt"`
	Hashtags         []string  `json:"hashtags"`
	Tags             []string  `json:"tags"`
	ImageUrls        []string  `json:"imageUrls"`
	Type             string    `json:"type"`
}
