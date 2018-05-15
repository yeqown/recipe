package models

import (
	"github.com/go-redis/redis"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	. "github.com/yeqown/gweb/logger"
	"github.com/yeqown/gweb/utils"
	"gopkg.in/mgo.v2"
	"math"
	"strings"
	"time"
)

type (
	SqlDB        *gorm.DB
	RedisClient  *redis.Client
	MongoSession *mgo.Session
)

var (
	mysqlIns *gorm.DB
	redisIns *redis.Client
	mgoIns   *mgo.Session
)

type MysqlConfig struct {
	Addr      string `json:"Addr"`
	Loc       string `json:"Loc"`
	Charset   string `json:"Charset"`
	Pool      int    `json:"pool"`
	ParseTime string `json:"ParseTime"`
}

type MongoConfig struct {
	Addrs     string `json:"Addrs"`
	Timeout   int64  `json:"Timeout"`
	PoolLimit int    `json:"PoolLimit"`
}

type RedisConfig struct {
	Addr        string `json:"Addr"`
	DB          int    `json:"DB"`
	Password    string `json:"Password"`
	PoolSize    int    `json:"PoolSize"`
	Timeout     int    `json:"Timeout"`
	MaxActive   int    `json:"MaxActive"`
	MaxIdle     int    `json:"MaxIdle"`
	IdleTimeout int    `json:"IdleTimeout"`
	Wait        bool   `json:"Wait"`
}

// Connect to mysql
func ConnectMysql(myc *MysqlConfig) {
	conStr := utils.Fstring("%sloc=%s&parseTime=%s&charset=%s",
		myc.Addr,
		myc.Loc,
		myc.ParseTime,
		myc.Charset,
	)
	AppL.Infof("Connect to mysql with Connect string: %s\n", conStr)
	db, err := gorm.Open("mysql", conStr)
	if err != nil {
		AppL.Fatalf("Open mysql failed: %s\n", err.Error())
	}

	db.DB().SetMaxOpenConns(myc.Pool)
	db.DB().SetMaxIdleConns(myc.Pool / 2)
	db.LogMode(false)
	db.SingularTable(true)

	if err = db.DB().Ping(); err != nil {
		AppL.Fatalf("Ping mysql failed: %s", err.Error())
	}
	mysqlIns = db
}

// Connect to Mongo
func ConnectMongo(moc *MongoConfig) {
	info := mgo.DialInfo{
		Addrs:     strings.Split(moc.Addrs, ","),
		Timeout:   time.Duration(moc.Timeout * int64(math.Pow10(9))),
		PoolLimit: moc.PoolLimit,
	}
	// connect db
	session, err := mgo.DialWithInfo(&info)
	if err != nil {
		AppL.Fatalf("Ping mysql failed: %s", err.Error())
	}
	mgoIns = session
	AppL.Info("Mongo connected, address: " + moc.Addrs)

	// settings
	mgoIns.SetMode(mgo.Strong, true)
	mgoIns.SetSocketTimeout(time.Duration(5 * time.Second))
}

// Connect to Redis
func ConnectRedis(rec *RedisConfig) {
	AppL.Info("Connect to redis")
	redisIns = redis.NewClient(&redis.Options{
		Addr:     rec.Addr,
		Password: rec.Password,
		DB:       rec.DB,
		PoolSize: rec.PoolSize,
	})
}

/*
 * Get db connection
 * Mysql / Redis / Mongo .etc
 */

// Get Mysql Connection
func GetMysqlDB() *gorm.DB {
	return mysqlIns
}

// Get Redis Connection
func GetRedisDB() *redis.Client {
	return redisIns
}

// Get Mgo Session Clone
func GetMongoClone() *mgo.Session {
	return mgoIns.Clone()
}

// Get Mgo Session
func GetMongoDB() *mgo.Session {
	return mgoIns
}

// Create Mgo DB
func NewMongoDB(dbName string) *mgo.Database {
	return GetMongoClone().DB(dbName)
}

// Create Mgo Collection
func NewMongoColl(dbName, collName string) *mgo.Collection {
	return NewMongoDB(dbName).C(collName)
}
