// Package middleware include param, reqlog, response, safe
// related functional modules
// current safe.go mainly log each request
package middleware

import (
	"encoding/json"
	"net/http"
	"net/url"
	. "recipes-server/logger"
	"recipes-server/utils"
)

func logReq(req *http.Request) {
	reqlog := RequestLog(req)
	ReqL.Info(reqlog)
}

func RequestLog(req *http.Request) string {
	return utils.Fstring("Path: [%s], Method: [%s], Headers: [%s], Form: [%s]",
		req.URL.Path,
		req.Method,
		headerToString(req.Header),
		valuesToString(req.Form),
	)
}

func headerToString(header http.Header) string {
	bs, _ := json.Marshal(header)
	return string(bs)
}

func valuesToString(values url.Values) string {
	bs, _ := json.Marshal(values)
	return string(bs)
}
