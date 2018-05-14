package models

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

func IsValidObjectId(id string) bool {
	return bson.IsObjectIdHex(id)
}

type Recipe struct {
	Id         bson.ObjectId `bson:"_id,omitempty" json:"id"`
	Name       string        `bson:"name" json:"name"`         // 名字
	Cat        string        `bson:"cat" json:"cat"`           // 分类
	Img        string        `bson:"img" json:"img"`           // 图片链接
	ViewCnt    string        `bson:"view_cnt" json:"view_cnt"` // 访问
	MarkCnt    string        `bson:"mark_cnt" json:"mark_cnt"` // 收藏
	CreateTime time.Time     `bson:"create_time" json:"create_time"`
	UpdateTime time.Time     `bson:"update_time" json:"update_time"`
}

type RecipeDetail struct {
	Id       bson.ObjectId `bson:"_id,omitempty" json:"id"`
	Name     string        `bson:"name" json:"name"`         // 名字
	Cat      string        `bson:"cat" json:"cat"`           // 分类
	Img      string        `bson:"img" json:"img"`           // 图片链接
	ViewCnt  string        `bson:"view_cnt" json:"view_cnt"` // 访问
	MarkCnt  string        `bson:"mark_cnt" json:"mark_cnt"` // 收藏
	Steps    []*Step       `bson:"steps" json:"steps"`       // 做法步骤
	Tip      string        `bson:"tip" json:"tip"`           // 小贴士
	Material struct {
		Ingredients []*material `bson:"ingredients" json:"ingredients"`
		Seasoning   []*material `bson:"seasoning" json:"seasoning"`
	} `bson:"material" json:"material"`
	CreateTime time.Time `bson:"create_time" json:"create_time"`
	UpdateTime time.Time `bson:"update_time" json:"update_time"`
}

type Step struct {
	Desc string `bson:"desc" json:"desc"`
	Img  string `bson:"img" json:"img"`
}

type material struct {
	Name   string `bson:"name" json:"name"`
	Weight string `bson:"weight" json:"weight"`
}

type RecipeDetailColl struct {
	*mgo.Collection
}

func NewRecipeDetailColl() *RecipeDetailColl {
	coll := NewMongoColl("recipe", "recipe_detail")
	return &RecipeDetailColl{coll}
}
