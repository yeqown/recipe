package models

import (
	"testing"
)

func Test_Redis(t *testing.T) {
	rc := &RedisConfig{
		Addr:        "127.0.0.1:6379",
		DB:          2,
		Password:    "",
		PoolSize:    10,
		Timeout:     50,
		MaxActive:   600,
		MaxIdle:     10,
		IdleTimeout: 500,
		Wait:        true,
	}

	ConnectRedis(rc)
	s := &Session{18, "12b8aefub2"}
	t.Log(s.Key())

	SetSession(s)
	ns := GetSessionValue(s.UserID)

	if ns.Ticket != s.Ticket {
		t.Logf("not equal, %s, %s \n", ns.Ticket, s.Ticket)
		t.Fail()
	}

	if !LookUpSession(s.UserID) {
		t.Log("not exist ")
		t.Fail()
	}

	if err := DelSession(s.UserID); err != nil {
		t.Log(err)
		t.Fail()
	}

	if LookUpSession(s.UserID) {
		t.Log("err should not exist")
		t.Fail()
	}
}
