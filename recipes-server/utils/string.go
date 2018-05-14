package utils

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	// "io"
	"math/rand"
	"time"
)

var (
	bs     []byte
	len_bs int
)

func init() {
	for i := 48; i < 123; i++ {
		switch {
		case i < 58:
			bs = append(bs, byte(i))
		case i >= 65 && i < 91:
			bs = append(bs, byte(i))
		case i >= 97 && i < 123:
			bs = append(bs, byte(i))
		}
	}

	len_bs = len(bs)
}

func Fstring(format string, v ...interface{}) string {
	return fmt.Sprintf(format, v...)
}

func RandStr(length int) string {
	var bsBuf bytes.Buffer

	for i := 0; i < length; i++ {
		pos := randInt(0, len_bs)
		bsBuf.WriteByte(bs[pos])
	}
	return bsBuf.String()
}

func randInt(min, max int) int {
	if min >= max {
		panic("min must be small than max value")
	}
	rand.Seed(time.Now().UnixNano())
	return min + rand.Intn(max-min)
}

func mixPasswordSalt(pwd, salt string) string {
	len_p, len_s := len(pwd), len(salt)
	len_mix := len_p + len_s
	pos_p, pos_s, pos_m := 0, 0, len_mix-1
	mixture := make([]byte, len_mix)
	for pos_p < len_p && pos_s < len_s {
		mixture[pos_m] = pwd[pos_p]
		mixture[pos_s] = pwd[pos_s]
		pos_m -= 2
		pos_p++
		pos_s++
	}

	for pos_p < len_p {
		mixture[pos_m] = pwd[pos_p]
		pos_m--
		pos_p++
	}

	for pos_s < len_s {
		mixture[pos_m] = pwd[pos_s]
		pos_m--
		pos_s++
	}

	return string(mixture)
}

func GenPasswordHash(pwd, salt string) string {
	h := sha256.New()
	mix := mixPasswordSalt(pwd, salt)
	h.Write([]byte(mix))
	return hex.EncodeToString(h.Sum(nil))
}
