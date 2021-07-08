package campaignstore

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"time"

	tracer "github.com/milossimic/grpc_rest/tracer"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type CampaignStore struct {
	db *gorm.DB
}

func New() (*CampaignStore, error) {
	ts := &CampaignStore{}

	host := os.Getenv("DBHOST")
	user := os.Getenv("USER")
	password := os.Getenv("PASSWORD")
	dbname := os.Getenv("DBNAME")
	dbport := os.Getenv("DBPORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", host, user, password, dbname, dbport)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println(err)
		return nil, err
	}
	ts.db = db
	ts.db.AutoMigrate(&Campaign{}, &Advertisement{}, &NumberOfViews{}, &Username{}, &CampaignInfluenserApproved{})

	return ts, nil
}

func (ts *CampaignStore) CreateCampaign(ctx context.Context, campaign *Campaign) (int, error) {
	span := tracer.StartSpanFromContext(ctx, "CreateCampaign")
	defer span.Finish()

	campaign.TargetAudience = *ts.FindUsernames(campaign.TargetAudience)
	campaign.Influensers = *ts.FindUsernames(campaign.Influensers)
	ts.db.Create(&campaign)

	return campaign.ID, nil
}

func (ts *CampaignStore) GetCampaign(ctx context.Context, id int) (*Campaign, error) {
	span := tracer.StartSpanFromContext(ctx, "CampaignStore")
	defer span.Finish()
	ts.UpdateCampaigns(ctx)

	var campaign Campaign
	result := ts.db.Preload("Influensers").Preload("TargetAudience").Find(&campaign, id)

	if result.RowsAffected > 0 {
		return &campaign, nil
	}
	return nil, errors.New("Campaign not found")
}

func (ts *CampaignStore) GetCampaigns(ctx context.Context, username string) (*[]Campaign, error) {
	span := tracer.StartSpanFromContext(ctx, "GetCampaigns")
	defer span.Finish()
	ts.UpdateCampaigns(ctx)

	var campaigns []Campaign
	result := ts.db.Preload("Influensers").Preload("TargetAudience").Where("username = ?", username).Find(&campaigns)

	if result.RowsAffected > 0 {
		return &campaigns, nil
	}
	return nil, errors.New("campaigns not found")
}

func (ts *CampaignStore) GetEditedCampaigns(ctx context.Context) []Campaign {
	span := tracer.StartSpanFromContext(ctx, "GetEditedCampaigns")
	defer span.Finish()

	var campaigns []Campaign
	ts.db.Where("(edit_for IS NOT null OR edit_for = 0) AND (created_at + INTERVAL '1 day') <= now()").Order("created_at").Find(&campaigns)
	return campaigns
}

func (ts *CampaignStore) UpdateCampaigns(ctx context.Context) {
	span := tracer.StartSpanFromContext(ctx, "UpdateCampaigns")
	defer span.Finish()

	campaigns := ts.GetEditedCampaigns(ctx)
	i := -1
	id := -1
	for _, campaign := range campaigns {
		id = campaign.ID
		if i == campaign.EditFor {
			ts.db.Exec("UPDATE campaign_target_audience SET campaign_id = ? WHERE campaign_id = ?", campaign.EditFor, campaign.ID)
			ts.db.Exec("UPDATE campaign_influenser SET campaign_id = ? WHERE campaign_id = ?", campaign.EditFor, campaign.ID)
			campaign.ID = campaign.EditFor
			campaign.EditFor = 0
			ts.db.Save(campaign)
		}
		ts.db.Delete(&Campaign{}, id)
		i = campaign.EditFor
	}
}

func (ts *CampaignStore) DeleteCampaign(ctx context.Context, id int) {
	span := tracer.StartSpanFromContext(ctx, "DeleteCampaign")
	defer span.Finish()

	ts.db.Exec("DELETE FROM advertisements WHERE campaign_id = ?", id)
	ts.db.Exec("DELETE FROM campaign_influenser WHERE campaign_id = ?", id)
	ts.db.Exec("DELETE FROM campaign_influenser_approveds WHERE campaign_id = ?", id)
	ts.db.Exec("DELETE FROM campaign_target_audience WHERE campaign_id = ?", id)
	ts.db.Exec("DELETE FROM number_of_views WHERE campaign_id = ?", id)
	ts.db.Exec("DELETE FROM campaigns WHERE id = ?", id)

}

func (ts *CampaignStore) CreateAdvertisement(ctx context.Context, advertisement *Advertisement) (int, error) {
	span := tracer.StartSpanFromContext(ctx, "CreateAdvertisement")
	defer span.Finish()

	ts.db.Create(&advertisement)

	return advertisement.ID, nil
}

func (ts *CampaignStore) GetAdvertisement(ctx context.Context, id int) (*Advertisement, error) {
	span := tracer.StartSpanFromContext(ctx, "GetAdvertisement")
	defer span.Finish()

	var advertisement Advertisement
	result := ts.db.Find(&advertisement, id)

	if result.RowsAffected > 0 {
		return &advertisement, nil
	}
	return nil, errors.New("advertisement not found")
}

func (ts *CampaignStore) GetAdvertisementsByCampaign(ctx context.Context, id int) ([]Advertisement, error) {
	span := tracer.StartSpanFromContext(ctx, "GetAdvertisementsByCampaign")
	defer span.Finish()

	var advertisements []Advertisement
	result := ts.db.Where("campaign_id = ?", id).Find(&advertisements)

	if result.RowsAffected > 0 {
		return advertisements, nil
	}
	return nil, errors.New("advertisements not found")
}

func (ts *CampaignStore) GetInfluencerAdvertisements(ctx context.Context, username string, postType int) ([]Advertisement, error) {
	span := tracer.StartSpanFromContext(ctx, "GetInfluencerAdvertisements")
	defer span.Finish()

	var advertisements []Advertisement
	result := ts.db.Where("Advertisements.campaign_id in (select distinct campaign_id from campaign_influenser ci, usernames u where ci.username_id = u.id and u.name = ?) and Advertisements.Publication_Type = ?", username, postType).Find(&advertisements)

	if result.RowsAffected > 0 {
		return advertisements, nil
	}
	return nil, errors.New("advertisements not found")
}

func (ts *CampaignStore) IsInfluenserCampaign(ctx context.Context, campaignId int) bool {
	span := tracer.StartSpanFromContext(ctx, "IsInfluenserCampaign")
	defer span.Finish()
	ts.UpdateCampaigns(ctx)

	campaign, _ := ts.GetCampaign(ctx, campaignId)
	return len(campaign.Influensers) > 0
}

func (ts *CampaignStore) IsInfluenserCampaignApproved(ctx context.Context, campaignId int, influenser string) bool {
	span := tracer.StartSpanFromContext(ctx, "IsInfluenserCampaignApproved")
	defer span.Finish()

	var cia CampaignInfluenserApproved
	result := ts.db.Where("campaign_id = ? and username = ?", campaignId, influenser).Find(&cia)
	return (result.RowsAffected > 0)
}

func (ts *CampaignStore) GetInfluensersUsernamesByCampaign(ctx context.Context, campaignId int) []string {
	span := tracer.StartSpanFromContext(ctx, "GetInfluensersUsernamesByCampaign")
	defer span.Finish()
	usernames := []string{}
	campaign, _ := ts.GetCampaign(ctx, campaignId)
	if len(campaign.Influensers) > 0 {
		for _, username := range campaign.Influensers {
			usernames = append(usernames, username.Name)
		}
	}
	return usernames
}

func (ts *CampaignStore) GetAdvertisementsByUser(ctx context.Context, username string, postType int) ([]Advertisement, error) {
	span := tracer.StartSpanFromContext(ctx, "GetAdvertisementsByUser")
	defer span.Finish()
	ts.UpdateCampaigns(ctx)

	var advertisements []Advertisement
	result := ts.db.Where("Advertisements.campaign_id in (select c.id from campaigns c, campaign_target_audience cta, usernames u where c.id = cta.campaign_id and u.id = cta.username_id and u.name = ? and c.start <= NOW() and c.end >= NOW()) and Advertisements.Publication_Type = ?", username, postType).Find(&advertisements)
	if result.RowsAffected > 0 {
		ads := ts.GetAvailableAds(ctx, advertisements, username)
		return *ads, nil
	}

	return nil, errors.New("advertisements not found")
}

func (ts *CampaignStore) GetInfluensersAdvertisementsByUser(ctx context.Context, username string, postType int) ([]Advertisement, error) {
	span := tracer.StartSpanFromContext(ctx, "GetInfluensersAdvertisementsByUser")
	defer span.Finish()
	ts.UpdateCampaigns(ctx)

	var advertisements []Advertisement
	result := ts.db.Where("Advertisements.campaign_id in (select c.id from campaigns c, campaign_target_audience cta, usernames u where c.id = cta.campaign_id and u.id = cta.username_id and u.name = ? and c.start <= NOW() and c.end >= NOW()) and Advertisements.Publication_Type = ?", username, postType).Find(&advertisements)
	if result.RowsAffected > 0 {
		ads := ts.GetAvailableInfluensersAds(ctx, advertisements, username)
		return *ads, nil
	}

	return nil, errors.New("advertisements not found")
}

func (ts *CampaignStore) GetAvailableAds(ctx context.Context, ads []Advertisement, username string) *[]Advertisement {
	ret := []Advertisement{}
	for _, ad := range ads {
		if ts.IsAdAvailable(ctx, ad, username) {
			ret = append(ret, ad)
		}
	}
	return &ret
}

func (ts *CampaignStore) GetAvailableInfluensersAds(ctx context.Context, ads []Advertisement, username string) *[]Advertisement {
	ret := []Advertisement{}
	for _, ad := range ads {
		if ts.IsInfluenserAdAvailable(ctx, ad, username) {
			ret = append(ret, ad)
		}
	}
	return &ret
}

func (ts *CampaignStore) SaveViews(ids []int, username string) {
	now := time.Now()
	for _, id := range ids {
		var nov NumberOfViews
		fmt.Println(id)
		fmt.Println(username)
		fmt.Println(now.Truncate(24 * time.Hour))
		result := ts.db.Where("campaign_id = ? and username = ? and date = ?", id, username, now.Truncate(24*time.Hour)).Find(&nov)
		if result.RowsAffected > 0 {
			nov.Number += 1
			ts.db.Save(&nov)
		} else {
			new_nov := &NumberOfViews{
				CampaignID: id,
				Username:   username,
				Number:     1,
				Date:       now.Truncate(24 * time.Hour),
			}
			ts.db.Create(new_nov)
		}
	}
}

func (ts *CampaignStore) IsAdAvailable(ctx context.Context, ad Advertisement, username string) bool {
	res := ts.IsInfluenserCampaign(ctx, ad.CampaignID)
	if res {
		return false
	}
	var campaign Campaign
	ts.db.Find(&campaign, ad.CampaignID)
	var nov NumberOfViews
	now := time.Now()
	result := ts.db.Where("campaign_id = ? and username = ? and date = ?", ad.CampaignID, username, now.Truncate(24*time.Hour)).Find(&nov)
	if result.RowsAffected > 0 {
		if nov.Number >= campaign.ShowNumber {
			return false
		}
	}
	return true
}

func (ts *CampaignStore) IsInfluenserAdAvailable(ctx context.Context, ad Advertisement, username string) bool {
	res := ts.IsInfluenserCampaign(ctx, ad.CampaignID)
	if !res {
		return false
	}
	var campaign Campaign
	ts.db.Find(&campaign, ad.CampaignID)
	var nov NumberOfViews
	now := time.Now()
	result := ts.db.Where("campaign_id = ? and username = ? and date = ?", ad.CampaignID, username, now.Truncate(24*time.Hour)).Find(&nov)
	if result.RowsAffected > 0 {
		if nov.Number >= campaign.ShowNumber {
			return false
		}
	}
	return true
}

func (ts *CampaignStore) FindUsernames(usernames []Username) *[]Username {
	ret := []Username{}
	for _, usr := range usernames {
		var u Username
		res := ts.db.FirstOrCreate(&u, Username{Name: usr.Name})
		if res.Error != nil {
			log.Println(res.Error)
		}
		ret = append(ret, u)
	}
	return &ret
}

func (ts *CampaignStore) Close() error {
	db, err := ts.db.DB()
	if err != nil {
		log.Println(err)
		return err
	}

	db.Close()
	return nil
}
