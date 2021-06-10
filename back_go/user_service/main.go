package main

import "back_go/user_service/api"
import "back_go/user_service/database"
import "back_go/user_service/users"

func main() {

  database.InitDatabase()
  users.MigrateInfo()
  api.StartApi()
}
