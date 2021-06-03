package main

import "back_go/auth_service/registration2/api"
import "back_go/auth_service/registration2/database"
import "back_go/auth_service/registration2/migrations"

func main() {

  database.InitDatabase()
  migrations.Migrate()
  api.StartApi()
}
