package adminstore

import (
	"context"
	"fmt"
	"os"

	tracer "github.com/milossimic/grpc_rest/tracer"
	log "github.com/sirupsen/logrus"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type AdminStore struct {
	db *gorm.DB
}

func New() (*AdminStore, error) {
	ts := &AdminStore{}

	host := os.Getenv("DBHOST")
	user := os.Getenv("USER")
	password := os.Getenv("PASSWORD")
	dbname := os.Getenv("DBNAME")
	dbport := os.Getenv("DBPORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", host, user, password, dbname, dbport)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Error(err)
		return nil, err
	}
	ts.db = db
	ts.db.AutoMigrate(&ReportRequest{}, &AgentRequest{}, &VerificationRequest{})
	return ts, nil
}

func (ts *AdminStore) CreateAgentRequest(ctx context.Context, username string) (int, error) {
	span := tracer.StartSpanFromContext(ctx, "CreateAgentRequest")
	defer span.Finish()

	agentReq := AgentRequest{
		Username: username,
		Status:   "CREATED",
	}

	ts.db.Create(&agentReq)

	return agentReq.ID, nil
}

func (ts *AdminStore) DeleteAgentRequest(ctx context.Context, id int) error {
	span := tracer.StartSpanFromContext(ctx, "DeleteAgentRequest")
	defer span.Finish()

	var request AgentRequest
	res := ts.db.FirstOrCreate(&request, AgentRequest{ID: id})
	if res.Error != nil {
		log.Error(res.Error)
		return res.Error
	}
	ts.db.Exec("DELETE FROM agent_requests WHERE id = ?", id)
	return nil
}

func (ts *AdminStore) ApproveAgentRequest(ctx context.Context, id int) error {
	span := tracer.StartSpanFromContext(ctx, "ApproveAgentRequest")
	defer span.Finish()

	var request AgentRequest
	ts.db.Find(&request, id)
	request.Status = "APPROVED"
	ts.db.Save(&request)
	return nil
}

func (ts *AdminStore) GetAgentRequests(ctx context.Context) ([]AgentRequest, error) {
	span := tracer.StartSpanFromContext(ctx, "GetAgentRequests")
	defer span.Finish()

	var requests []AgentRequest
	ts.db.Find(&requests)

	return requests, nil
}

func (ts *AdminStore) IsUserAgent(ctx context.Context, username string) bool {
	span := tracer.StartSpanFromContext(ctx, "IsUserAgent")
	defer span.Finish()

	var request AgentRequest
	result := ts.db.Where("username = ?", username).Find(&request)

	if result.RowsAffected > 0 && request.Status == "APPROVED" {
		return true
	}

	return false
}

func (ts *AdminStore) CreateReport(ctx context.Context, publicationId int, reporter string, postType string) (int, error) {
	span := tracer.StartSpanFromContext(ctx, "CreateReport")
	defer span.Finish()

	reportReq := ReportRequest{
		PublicationID:    publicationId,
		ReporterUsername: reporter,
		Type:             postType,
		Status:           "CREATED",
	}

	ts.db.Create(&reportReq)

	return reportReq.ID, nil
}

func (ts *AdminStore) DeleteReport(ctx context.Context, id int) error {
	span := tracer.StartSpanFromContext(ctx, "DeleteReport")
	defer span.Finish()

	var report ReportRequest
	res := ts.db.FirstOrCreate(&report, ReportRequest{ID: id})
	if res.Error != nil {
		log.Error(res.Error)
		return res.Error
	}
	ts.db.Exec("DELETE FROM report_requests WHERE id = ?", id)
	return nil
}

func (ts *AdminStore) GetReports(ctx context.Context) ([]ReportRequest, error) {
	span := tracer.StartSpanFromContext(ctx, "GetReports")
	defer span.Finish()

	var reports []ReportRequest
	ts.db.Find(&reports)

	return reports, nil
}

func (ts *AdminStore) GetReportsForUser(ctx context.Context, username string) ([]ReportRequest, error) {
	span := tracer.StartSpanFromContext(ctx, "GetReportsForUser")
	defer span.Finish()

	var reports []ReportRequest
	ts.db.Where("reporter_username = ?", username).Find(&reports)

	return reports, nil
}

func (ts *AdminStore) GetReport(ctx context.Context, id int) (ReportRequest, error) {
	span := tracer.StartSpanFromContext(ctx, "GetReport")
	defer span.Finish()

	var report ReportRequest
	ts.db.Find(&report, id)

	return report, nil
}

func (ts *AdminStore) CreateVerificationRequest(ctx context.Context, name string, surname string, category string, username string) (int, error) {
	span := tracer.StartSpanFromContext(ctx, "CreateVerificationRequest")
	defer span.Finish()

	verificationReq := VerificationRequest{
		Name:     name,
		Surname:  surname,
		Category: category,
		Username: username,
	}

	ts.db.Create(&verificationReq)

	return verificationReq.ID, nil
}

func (ts *AdminStore) GetVerificationRequests(ctx context.Context) ([]VerificationRequest, error) {
	span := tracer.StartSpanFromContext(ctx, "GetVerificationRequests")
	defer span.Finish()

	var requests []VerificationRequest
	ts.db.Find(&requests)

	return requests, nil
}

func (ts *AdminStore) GetVerificationRequestById(ctx context.Context, id int) (VerificationRequest, error) {
	span := tracer.StartSpanFromContext(ctx, "GetVerificationRequestById")
	defer span.Finish()

	var request VerificationRequest
	ts.db.Find(&request, id)

	return request, nil
}

func (ts *AdminStore) UpdateVerificationRequestStatus(ctx context.Context, id int, status bool) error {
	span := tracer.StartSpanFromContext(ctx, "UpdateVerificationStatus")
	defer span.Finish()

	verificationReq, err := ts.GetVerificationRequestById(ctx, id)

	if err != nil {
		return err
	}

	verificationReq.Approved = status

	ts.db.Save(&verificationReq)

	return nil
}

func (ts *AdminStore) UpdateReportRequestStatus(id int, status string) error {
	var request ReportRequest
	ts.db.Find(&request, id)

	request.Status = status

	ts.db.Save(&request)

	return nil

}
func (ts *AdminStore) Close() error {
	db, err := ts.db.DB()
	if err != nil {
		log.Error(err)
		return err
	}
	db.Close()
	return nil
}
