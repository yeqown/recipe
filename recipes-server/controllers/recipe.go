package controllers

import (
	. "recipes-server/constant"
	. "recipes-server/logger"
	M "recipes-server/models"
	S "recipes-server/services"
	// "recipes-server/utils"
	"sync"
)

type RecipeCntForm struct{}

var PoolRecipeCntForm = &sync.Pool{New: func() interface{} { return &RecipeCntForm{} }}

type RecipeCntResp struct {
	CodeInfo
	Cnt int `json:"count"`
}

var PoolRecipeCntResp = &sync.Pool{New: func() interface{} { return &RecipeCntResp{} }}

func RecipeCountGet(req *RecipeCntForm) *RecipeCntResp {
	res := PoolRecipeCntResp.Get().(*RecipeCntResp)
	defer PoolRecipeCntResp.Put(res)

	res.Cnt = S.GetCountOfRecipe()
	AppL.Infof("get count: %d\n", res.Cnt)

	Response(res, NewCodeInfo(CodeOk, ""))
	return res
}

// get recipes by category and limit then skip
//
type GetRecipeByCatForm struct {
	Cat   string `schema:"cat" valid:"Required;MinSize(1)" json:"cat"`
	Limit int    `schema:"limit" valid:"Min(1)" json:"limit"`
	Skip  int    `schema:"skip" valid:"Min(0)" json:"skip"`
}

var PoolGetRecipeByCatForm = &sync.Pool{New: func() interface{} { return &GetRecipeByCatForm{} }}

type GetRecipeByCatResp struct {
	CodeInfo
	Total   int         `json:"total"`
	Recipes []*M.Recipe `json:"recipe"`
}

var PoolGetRecipeByCatResp = &sync.Pool{New: func() interface{} { return &GetRecipeByCatResp{} }}

func GetRecipeByCat(req *GetRecipeByCatForm) *GetRecipeByCatResp {
	res := PoolGetRecipeByCatResp.Get().(*GetRecipeByCatResp)
	defer PoolGetRecipeByCatResp.Put(res)

	if req.Limit == 0 {
		req.Limit = 10
	}

	rds := S.GetRecipeOfCategory(req.Cat, req.Limit, req.Skip)
	res.Recipes = rds
	res.Total = S.GetCountOfOneCat(req.Cat)
	// AppL.Infof("get recipes: %v\n", rds)

	Response(res, NewCodeInfo(CodeOk, ""))
	return res
}

// get recipe detail by id
//
type GetRecipeDetailForm struct {
	Id string `schema:"id" valid:"Required;MinSize(1)" json:"id"`
}

var PoolGetRecipeDetailForm = &sync.Pool{New: func() interface{} { return &GetRecipeDetailForm{} }}

type GetRecipeDetailResp struct {
	CodeInfo
	RecipeDetail *M.RecipeDetail `json:"recipe_detail"`
}

var PoolGetRecipeDetailResp = &sync.Pool{New: func() interface{} { return &GetRecipeDetailResp{} }}

func GetRecipeDetail(req *GetRecipeDetailForm) *GetRecipeDetailResp {
	res := PoolGetRecipeDetailResp.Get().(*GetRecipeDetailResp)
	defer PoolGetRecipeDetailResp.Put(res)
	res.RecipeDetail = nil

	rd, err := S.GetRecipeDetailById(req.Id)
	// AppL.Infof("get recipe detail: %v\n", rd)

	if err != nil {
		AppL.Error(err.Error())
		Response(res, NewCodeInfo(CodeSystemErr, err.Error()))
		return res
	}

	res.RecipeDetail = rd
	Response(res, NewCodeInfo(CodeOk, ""))
	return res
}

type GetRecipeCategoriesForm struct{}

var PoolGetRecipeCategoriesForm = &sync.Pool{New: func() interface{} { return &GetRecipeCategoriesForm{} }}

type GetRecipeCategoriesResp struct {
	CodeInfo
	Categories []string `json:"recipe_categories"`
}

var PoolGetRecipeCategoriesResp = &sync.Pool{New: func() interface{} { return &GetRecipeCategoriesResp{} }}

func GetRecipeCategories(req *GetRecipeCategoriesForm) *GetRecipeCategoriesResp {
	res := PoolGetRecipeCategoriesResp.Get().(*GetRecipeCategoriesResp)
	defer PoolGetRecipeCategoriesResp.Put(res)

	res.Categories = nil
	cats, err := S.GetAllRecipeCategory()
	if err != nil {
		AppL.Error(err.Error())
		Response(res, NewCodeInfo(CodeSystemErr, err.Error()))
		return res
	}

	res.Categories = cats
	Response(res, NewCodeInfo(CodeOk, ""))
	return res
}
