package adminstore

type ReportRequest struct {
	ID               int    `json:"id"`
	PublicationID    int    `json:"PublicationId"`
	ReporterUsername string `json:"username"`
	Type             string `json:"type"`
}
