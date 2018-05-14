package main

import (
	. "recipes-server/logger"

	"flag"
)

var conf = flag.String("conf", "./configs/config.json", "-conf filename")

func main() {
	flag.Parse()
	// TODO:
	// 1. load config
	// 2. connect to db or cache, and other initial works
	// 3. start server

	if err := LoadConfig(*conf); err != nil {
		AppL.Fatal(err.Error())
	}
	InitLogger(_instance.ServerC.Logpath)
	ConnectDBs()

	// go startRpcServer()
	startServer()
}
