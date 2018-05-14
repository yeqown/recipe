package utils

import (
	"crypto/md5"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	// "fmt"
	"io"
)

// str2hex md5
func StringEncMd5(s string) string {
	m := md5.New()
	io.WriteString(m, s)
	return hex.EncodeToString(m.Sum(nil))
}

//生成Guid字串
func UniqueId() string {
	b := make([]byte, 48)
	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		println(err)
		return ""
	}
	return StringEncMd5(base64.URLEncoding.EncodeToString(b))
}
