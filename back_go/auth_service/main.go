package main

import "back_go/auth_service/registration/api"
//import "back_go/auth_service/registration/migrations"

func main() {
  //migrations.Migrate()
  api.StartApi()
}
