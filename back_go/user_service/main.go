package main

import "back_go/user_service/api"
import "back_go/user_service/database"
import "back_go/user_service/users"
import "back_go/user_service/logger"
//import log "github.com/sirupsen/logrus"

func main() {

  logger.FileOpen()
  //log.SetOutput(logger.FILE)
  database.InitDatabase()
  users.MigrateInfo()
  api.StartApi()
}
