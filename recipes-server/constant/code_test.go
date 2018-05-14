package constant

import (
	"testing"
)

func Test_NewCodeInfo(t *testing.T) {
	ci := NewCodeInfo(CodeOk, "message")
	if ci.Message != "message" {
		t.FailNow()
	}

	ci = NewCodeInfo(CodeOk, "")
	if ci.Message == "" {
		t.FailNow()
	}
}

func Test_Response(t *testing.T) {
	type TestStruct struct {
		CodeInfo
		OtherInfo string
	}

	tsptr := new(TestStruct)
	ts := make(TestStruct)
	tint := 0

	ci := NewCodeInfo(CodeOk, "")
	t.Log(*ci)

	Response(tsptr, ci)
	Response(ts, ci)
	Response(tint, ci)

	t.Log(*tsptr)
	t.Log(ts)
	t.Log(tint)

}
