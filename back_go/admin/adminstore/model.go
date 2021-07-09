package adminstore

type AgentRequest struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Status   string `json:"status"`
}

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
