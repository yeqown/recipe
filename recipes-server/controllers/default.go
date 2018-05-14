package controllers

import (
	// . "recipes-server/constant"
	// "recipes-server/router/middleware"

	"net/http"
)

type (
	NfHandler  int
	MnaHandler int
)

var (
	NfController  *NfHandler  // not found handler
	MnaController *MnaHandler // method not allowed
)

func (n *NfHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	// ci := NewCodeInfo(CodeNotFound, "")
	http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
	// middleware.ResponseJson(w)
	// WriteErrResp(w, http.StatusNotFound, ci.Code, ci.Message)
}

func (m *MnaHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	// ci := NewCodeInfo(CodeMethodNotAllowed, "")
	http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
	// WriteErrResp(w, http.StatusMethodNotAllowed, ci.Code, ci.Message)
}
