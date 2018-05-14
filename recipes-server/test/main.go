package main

import (
	"recipes-server/controllers/rpctr"

	"net"
	// "net/rpc"
	"log"
	"net/rpc/jsonrpc"
)

func main() {
	// var t *testing.T = new(testing.T)

	conn, err := net.Dial("tcp", "127.0.0.1:5051")
	if err != nil {
		log.Fatal(err.Error())
	}

	client := jsonrpc.NewClient(conn)
	var reply int = 0
	if err := client.Call("Calculator.AddInt",
		&rpctr.CalculatorArgs{A: 1, B: 2},
		&reply,
	); err != nil {
		log.Fatal(err.Error())
	}
	log.Println(reply)
}
