package controllers

import (
	. "github.com/yeqown/gweb/logger"
	. "github.com/yeqown/gweb/utils"
	"sync"

	"recipes-server/models"
	S "recipes-server/services"
)

// 搜索菜谱
type RecipeSearchForm struct {
	RecipeName string `schema:"recipe_name" valid:"Required;MinSize(1)"`
	Limit      int    `schema:"limit"`
	Skip       int    `schema:"skip"`
}

var PoolRecipeSearchForm = &sync.Pool{New: func() interface{} { return &RecipeSearchForm{} }}

type RecipeSearchResp struct {
	CodeInfo
	Recipes []*models.Recipe `json:"recipes"`
	Total   int              `json:"total"`
}

var PoolRecipeSearchResp = &sync.Pool{New: func() interface{} { return &RecipeSearchResp{} }}

func RecipeSearchGet(req *RecipeSearchForm) *RecipeSearchResp {
	res := PoolRecipeSearchResp.Get().(*RecipeSearchResp)
	defer PoolRecipeSearchResp.Put(res)

	res.Recipes = nil

	if req.Limit == 0 {
		req.Limit = 10
	}

	// TODO: searchRecipeByName
	rs, total, err := S.SearchRecipeByName(req.RecipeName, req.Limit, req.Skip)
	if err != nil {
		AppL.Error(err.Error())
		Response(res, NewCodeInfo(CodeSystemErr, err.Error()))
		return res
	}

	res.Recipes = rs
	res.Total = total

	Response(res, NewCodeInfo(CodeOk, ""))
	return res
}
