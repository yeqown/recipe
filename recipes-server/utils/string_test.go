package utils

import (
	"testing"
)

func Test_RandInt(t *testing.T) {
	a := randInt(10, 22)
	if a < 10 || a > 22 {
		t.Error("not in range 10:22")
		t.Fail()
	}
}

func Test_RandStr(t *testing.T) {
	s := RandStr(12)
	if len(s) != 12 {
		t.Error("wrong rand str")
		t.Fail()
	}
	t.Log(s)
}
