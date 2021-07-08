package saga

import "encoding/json"

const (
	OAdminChannel  string = "AdminChannel"
	PostChannel    string = "PostChannel"
	ReplyChannel   string = "ReplyChannel"
	ServiceAdmin   string = "Admin"
	ServicePost    string = "Stock"
	ActionStart    string = "Start"
	ActionDone     string = "DoneMsg"
	ActionError    string = "ErrorMsg"
	ActionRollback string = "RollbackMsg"
)

type Message struct {
	Service         string `json:"service"`
	SenderService   string `json:"sender_service"`
	Action          string `json:"action"`
	ReportId        int    `json:"report_id"`
	PublicationId   int    `json:"publication_id"`
	PublicationType string `json:"publication_type"`
	Ok              bool   `json:"ok"`
}

func (m Message) MarshalBinary() ([]byte, error) {
	return json.Marshal(m)
}
