package main

import (
	"bufio"
	"encoding/json"
	"github.com/yeqown/gweb"
	"os"

	"recipes-server/models"
)

var (
	db_ins     *DBConf
	server_ins *ServerConf
)

type ServerConf struct {
	HttpC *gweb.ServerConfig    `json:"ServerConfig"`
	RpcC  *gweb.RpcServerConfig `json:"RpcServerConfig"`
}

type DBConf struct {
	MysqlC *models.MysqlConfig `json:"MysqlConfig"`
	RedisC *models.RedisConfig `json:"RedisConfig"`
	MgoC   *models.MongoConfig `json:"MongoConfig"`
}

func loadDBConf(file string) error {
	fp, err := os.Open(file)
	defer fp.Close()
	if err != nil {
		return err
	}
	body, _ := bufio.NewReader(fp).ReadBytes(0)
	if err = json.Unmarshal(body, &db_ins); err != nil {
		return err
	}
	return nil
}

func loadServerConf(file string) error {
	fp, err := os.Open(file)
	defer fp.Close()
	if err != nil {
		return err
	}
	body, _ := bufio.NewReader(fp).ReadBytes(0)
	if err = json.Unmarshal(body, &server_ins); err != nil {
		return err
	}
	return nil
}
