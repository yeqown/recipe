package main

import (
	"recipes-server/models"

	"bufio"
	"encoding/json"
	"os"
)

type ServerConfig struct {
	Port    int    `json:"Port"`
	Logpath string `json:"Logpath"`
}

type RpcServerConfig struct {
	Host      string `json:"host"`       // host
	Port      int    `json:"port"`       // port
	Path      string `json:"path"`       // path
	DebugPath string `json:"debug_path"` // debug_path
	Network   string `json:"network"`    // tcp http
}

type Config struct {
	ServerC *ServerConfig       `json:"ServerConfig"`
	RpcC    *RpcServerConfig    `json:"RpcServerConfig"`
	MysqlC  *models.MysqlConfig `json:"MysqlConfig"`
	RedisC  *models.RedisConfig `json:"RedisConfig"`
	MgoC    *models.MongoConfig `json:"MongoConfig"`
}

var _instance *Config

func GetInstance() *Config {
	return _instance
}

func LoadConfig(filepath string) error {
	fp, err := os.Open(filepath)
	defer fp.Close()
	if err != nil {
		return err
	}
	body, _ := bufio.NewReader(fp).ReadBytes(0)
	if err = json.Unmarshal(body, &_instance); err != nil {
		return err
	}
	return nil
}
