package adminstore

type ReportRequest struct {
	ID               int    `json:"id"`
	PublicationID    int    `json:"PublicationId"`
	ReporterUsername string `json:"username"`
	Type             string `json:"type"`
	Status           string `json:"status"`
}

type VerificationRequest struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
	Category string `json:"category"`
	Username string `json:"username"`
	Approved bool   `json:"approved"`
}
