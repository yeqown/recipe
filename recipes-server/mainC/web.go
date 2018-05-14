// Package main
// Support HTTP Server, restful api handler, with timeout setting
//
// Support RPC Server, but this only called by golang rpc client,
// not good enough
package main

import (
	"recipes-server/constant"
	"recipes-server/controllers/rpctr"
	. "recipes-server/logger"
	"recipes-server/router"
	"recipes-server/utils"

	"net"
	"net/http"
	"net/rpc"
	"net/rpc/jsonrpc"
	"time"
)

// startServer over HTTP as for api server
func startServer() {
	router.RegisterHandler()

	server := &http.Server{
		Addr: utils.Fstring(":%d", _instance.ServerC.Port),
		Handler: http.TimeoutHandler(router.ApiHdl,
			5*time.Second,
			constant.TimeoutJsonResp,
		),
	}

	AppL.Infof("Http Server listening on: %d\n", _instance.ServerC.Port)
	if err := server.ListenAndServe(); err != nil {
		AppL.Fatal(err.Error())
	}
}

// startRpcSerevr running a server to deal with rpc request
// default set jsonrpc
func startRpcServer() {
	rpc_server := rpc.NewServer()
	registerRpcService(rpc_server)

	// DefaultRPCPath = "/_goRPC_"
	// DefaultDebugPath = "/debug/rpc"
	rpc_server.HandleHTTP(rpc.DefaultRPCPath, rpc.DefaultDebugPath)

	l, err := net.Listen(_instance.RpcC.Network,
		utils.Fstring("%s:%d",
			_instance.RpcC.Host,
			_instance.RpcC.Port,
		),
	)
	if err != nil {
		AppL.Fatal(err.Error())
	}

	AppL.Infof("Json-Rpc Listening on: %d\n", _instance.RpcC.Port)
	// loop listening
	for {
		conn, err := l.Accept()
		if err != nil {
			AppL.Fatal(err.Error())
		}

		AppL.Info("A new Rpc request received!")
		go rpc_server.ServeCodec(jsonrpc.NewServerCodec(conn))
	}
}

// registerRpcService register All service for rpc server
func registerRpcService(s *rpc.Server) {
	AppL.Info("registerRpcService doing...")
	// add calculator into service
	calculator := new(rpctr.Calculator)
	s.Register(calculator)
}
