package models

import (
	"encoding/json"
	"recipes-server/utils"
	"time"
)

const Expiration = 3600 * time.Second

type Session struct {
	UserID int64  `json:"user_id"`
	Ticket string `json:"ticket"`
}

func (s *Session) String() string {
	bs, _ := json.Marshal(*s)
	return string(bs)
}

func (s *Session) Key() string {
	return utils.Fstring("%d", s.UserID)
}

func SetSession(s *Session) error {
	statusCmd := getRedisDB().Set(s.Key(), s.Ticket, Expiration)
	return statusCmd.Err()
}

func GetSessionValue(userid int64) *Session {
	key := (&Session{UserID: userid}).Key()
	stringCmd := getRedisDB().Get(key)
	ticket := stringCmd.Val()
	return &Session{UserID: userid, Ticket: ticket}
}

func DelSession(userid int64) error {
	key := (&Session{UserID: userid}).Key()
	intCmd := getRedisDB().Del(key)
	return intCmd.Err()
}

func LookUpSession(userid int64) bool {
	key := (&Session{UserID: userid}).Key()
	intCmd := getRedisDB().Exists(key)
	return intCmd.Val() == 1
}
