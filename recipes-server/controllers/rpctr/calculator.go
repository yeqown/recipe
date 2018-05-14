// Package rpctr includes all rpc Service and ServiceMethod

package rpctr

type Calculator int

type CalculatorArgs struct {
	A int `json:"a"`
	B int `json:"b"`
}

func (c *Calculator) AddInt(args *CalculatorArgs, reply *int) error {
	*reply = args.A + args.B
	return nil
}
