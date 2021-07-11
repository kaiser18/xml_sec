package main

import (
    "github.com/gorilla/mux"
    "fmt"
    "net/http"
    "log"
    "gorm.io/gorm"
    "back_go/agent/database"
    "back_go/agent/repository"
    "back_go/agent/services"
    "back_go/agent/handler"
)

func initAuthRepo(db *gorm.DB) *repository.AuthRepository {
	return &repository.AuthRepository{Database: db}
}

func initAuthService(repo *repository.AuthRepository) *services.AuthService {
	return &services.AuthService{AuthRepository: repo}
}

func initAuthHandler(service *services.AuthService) *handler.AuthHandler {
	return &handler.AuthHandler{AuthService: service}
}

func initProductRepo(db *gorm.DB) *repository.ProductRepository {
	return &repository.ProductRepository{Database: db}
}

func initProductService(repo *repository.ProductRepository) *services.ProductService {
	return &services.ProductService{ProductRepository: repo}
}

func initProductHandler(service *services.ProductService) *handler.ProductHandler {
	return &handler.ProductHandler{ProductService: service}
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
func handlerFunc(authHandler *handler.AuthHandler, productHandler *handler.ProductHandler) {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/register", authHandler.Register).Methods("POST")
	router.HandleFunc("/login", authHandler.LogIn).Methods("POST")
	router.HandleFunc("/validate/{id}/{uuid}", authHandler.ValidateUser).Methods("GET")
    router.HandleFunc("/product", productHandler.GetAllProducts).Methods("GET")
	router.HandleFunc("/product/{id}", productHandler.GetProductById).Methods("GET")

	router.HandleFunc("/product", authHandler.AuthService.RBAC(productHandler.CreateProduct, "CREATE_PRODUCT", false)).Methods("POST")
	router.HandleFunc("/product/{id}", authHandler.AuthService.RBAC(productHandler.DeleteProduct, "DELETE_PRODUCT", false)).Methods("DELETE")
	router.HandleFunc("/product", authHandler.AuthService.RBAC(productHandler.UpdateProduct, "UPDATE_PRODUCT", false)).Methods("PUT")
	router.HandleFunc("/order", authHandler.AuthService.RBAC(productHandler.CreateOrder, "CREATE_ORDER", false)).Methods("POST")
	router.HandleFunc("/api-token", authHandler.AuthService.RBAC(authHandler.CreateAPIToken, "CREATE_TOKEN", false)).Methods("POST")

    fmt.Println("Agent application started on port 23007 ")
    log.Fatal(http.ListenAndServe(":23007", router))

}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

func main() {

  database.InitDatabase()
  authRepo := initAuthRepo(database.DB)
  authService := initAuthService(authRepo)
  authHandler := initAuthHandler(authService)
  productRepo := initProductRepo(database.DB)
  productService := initProductService(productRepo)
  productHandler := initProductHandler(productService)
  handlerFunc(authHandler, productHandler)
  fmt.Println("Izgleda da aplikacija uopste ne slusa ")

}
