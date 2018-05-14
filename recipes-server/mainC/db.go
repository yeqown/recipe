package main

import (
	. "recipes-server/logger"
	"recipes-server/models"
)

/*
 * connect entry
 * like:
 */
func ConnectDBs() {
	// _ins := GetInstance()
	if _instance == nil {
		AppL.Fatal("Config instance is nil")
	}

	// models.ConnectMysql(_instance.MysqlC)
	models.ConnectMongo(_instance.MgoC)
	models.ConnectRedis(_instance.RedisC)
	// models.ConnectPostgres()
}
