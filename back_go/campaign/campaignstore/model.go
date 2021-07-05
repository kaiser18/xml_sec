package campaignstore

import "time"

type Campaign struct {
	ID             int        `json:"id"`
	Username       string     `json:"username"`
	CreatedAt      time.Time  `gorm:"type:time" json:"createdAt"`
	Start          time.Time  `gorm:"type:time" json:"start"`
	End            time.Time  `gorm:"type:time" json:"end"`
	ShowNumber     int        `json:"showNumber"`
	CampaignType   int        `json:"campaignType"`
	TargetAgeFrom  int        `json:"targetAgeFrom"`
	TargetAgeTo    int        `json:"targetAgeTo"`
	TargetAudience []Username `gorm:"many2many:campaign_target_audience;" json:"targetAudience"`
	Influensers    []Username `gorm:"many2many:campaign_influenser;" json:"influensers"`
	EditFor        int        `json:"editFor"`
}

type Advertisement struct {
	ID              int    `json:"id"`
	CampaignID      int    `json:"campaignId"`
	PublicationID   int    `json:"publicationId"`
	PublicationType int    `json:"publicationType"`
	Link            string `json:"link"`
}

type NumberOfViews struct {
	ID         int       `json:"id"`
	CampaignID int       `json:"campaignId"`
	Username   string    `json:"username"`
	Number     int       `json:"number"`
	Date       time.Time `gorm:"type:time" json:"date"`
}

type CampaignInfluenserApproved struct {
	ID         int    `json:"id"`
	CampaignID int    `json:"campaignId"`
	Username   string `json:"username"`
}

type Username struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
