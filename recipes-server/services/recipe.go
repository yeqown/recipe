package services

import (
	"errors"
	. "github.com/yeqown/gweb/logger"
	"gopkg.in/mgo.v2/bson"

	M "recipes-server/models"
)

var (
	ErrInvalidObjectIdHex = errors.New("not valid object id hex string")
)

func GetCountOfRecipe() int {
	coll := M.NewRecipeDetailColl()
	defer coll.Database.Session.Close()

	cnt, err := coll.Count()
	if err != nil {
		AppL.Error(err.Error())
		return 0
	}
	return cnt
}

func GetCountOfOneCat(cat string) int {
	coll := M.NewRecipeDetailColl()
	defer coll.Database.Session.Close()

	cnt, err := coll.Find(&bson.M{"cat": cat}).Count()
	if err != nil {
		AppL.Error(err.Error())
		return 0
	}
	return cnt
}

func GetRecipeOfCategory(cat string, limit, skip int) []*M.Recipe {
	rds := make([]*M.Recipe, 0, limit)
	coll := M.NewRecipeDetailColl()
	defer coll.Database.Session.Close()

	if err := coll.Find(bson.M{"cat": cat}).
		Skip(skip).
		Limit(limit).
		All(&rds); err != nil {
		AppL.Error(err.Error())
		return []*M.Recipe{}
	}
	return rds
}

func GetRecipeDetailById(id string) (*M.RecipeDetail, error) {
	if !M.IsValidObjectId(id) {
		return nil, ErrInvalidObjectIdHex
	}

	rd := &M.RecipeDetail{}
	coll := M.NewRecipeDetailColl()
	defer coll.Database.Session.Close()

	if err := coll.Find(
		bson.M{
			"_id": bson.ObjectIdHex(id),
		},
	).One(rd); err != nil {
		return nil, err
	}
	return rd, nil
}

func GetAllRecipeCategory() ([]string, error) {
	coll := M.NewRecipeDetailColl()
	defer coll.Database.Session.Close()

	cats := make([]string, 0, 100)

	if err := coll.Find(nil).Distinct("cat", &cats); err != nil {
		return cats, err
	}

	return cats, nil
}
