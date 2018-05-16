package controllers

import (
	. "github.com/yeqown/gweb/logger"
	. "github.com/yeqown/gweb/utils"
	"math/rand"
	"sync"
	"time"

	"recipes-server/models"
	S "recipes-server/services"
)

// 每天推荐
type RecipeRecommendForm struct {
	ForceChange bool `schema:"force_change"`
}

var PoolRecipeRecommendForm = &sync.Pool{New: func() interface{} { return &RecipeRecommendForm{} }}

type RecipeRecommendResp struct {
	CodeInfo
	Recipes []*models.RecipeDetail `json:"recommend_recipes"`
}

var PoolRecipeRecommendResp = &sync.Pool{New: func() interface{} { return &RecipeRecommendResp{} }}

type todayRecommend struct {
	RequestTime time.Time
	Recipes     []*models.RecipeDetail
}

var today_recommend = new(todayRecommend)

func RecipeRecommendGet(req *RecipeRecommendForm) *RecipeRecommendResp {
	res := PoolRecipeRecommendResp.Get().(*RecipeRecommendResp)
	defer PoolRecipeRecommendResp.Put(res)

	res.Recipes = nil
	now := time.Now()

	// force to create
	if req.ForceChange {
		goto CreateTodayRecipe
	}

	if len(today_recommend.Recipes) != 0 &&
		today_recommend.RequestTime.Day() == now.Day() {

		res.Recipes = today_recommend.Recipes
		Response(res, NewCodeInfo(CodeOk, ""))
		return res
	}

CreateTodayRecipe:
	today_recommend.Recipes = make([]*models.RecipeDetail, 0, 5)
	total := S.GetCountOfRecipe()
	var (
		r   *models.RecipeDetail
		err error
	)

	_rand := rand.New(rand.NewSource(time.Now().Unix()))

	for i := 0; i < 3; i++ {
		skip := _rand.Intn(total)
		AppL.Infof("skip: %d", skip)

		if r, err = S.GetOneRecipeWithSkip(skip); err != nil {
			AppL.Error(err.Error())
			Response(res, NewCodeInfo(CodeSystemErr, err.Error()))
			return res
		}
		AppL.Infof("%v", *r)
		today_recommend.Recipes = append(today_recommend.Recipes, r)
	}
	today_recommend.RequestTime = time.Now()
	res.Recipes = today_recommend.Recipes

	Response(res, NewCodeInfo(CodeOk, ""))
	return res
}
