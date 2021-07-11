package dto

import "back_go/agent/interfaces"

type RegisterDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Address  string `json:"address"`
}

type LogInDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ProductDTO struct {
	Name         string  `json:"name"`
	Quantity     uint    `json:"quantity"`
	PricePerItem float64 `json:"pricePerItem"`
}

type TokenResponseDTO struct {
	Token  string            `json:"token"`
	Email  string            `json:"email"`
	UserId uint              `json:"userId"`
	Roles  []interfaces.Role `json:"roles"`
}

type OrderDTO struct {
	Items []ItemDTO `json:"items"`
}

type ItemDTO struct {
	ProductId uint `json:"productId"`
	Quantity  uint `json:"quantity"`
}

type UpdateProductDTO struct {
	ProductId    uint    `json:"productId"`
	Name         string  `json:"name"`
	Quantity     uint    `json:"quantity"`
	PricePerItem float64 `json:"pricePerItem"`
}

type ShowProductDTO struct {
	ID           uint    `json:"id"`
	Name         string  `json:"name"`
	PicturePath  string  `json:"picturePath"`
	PricePerItem float64 `json:"pricePerItem"`
	Quantity     uint    `json:"quantity"`
}
