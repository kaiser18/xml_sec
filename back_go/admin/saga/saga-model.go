package saga

import "encoding/json"

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
