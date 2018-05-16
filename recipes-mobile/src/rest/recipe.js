import { getApi } from './'

export function getRecipeDetailById({id}) {
	return getApi('/recipe/detail', {id})
}

export function getRecipeListByCategory({cat, limit=10, skip=0}) {
	return getApi('/recipe/listByCat', {cat, limit, skip})
}

export function getRecipeCategories(){
	return getApi('/recipe/category', {})
}

// 搜索
export function searchRecipe({recipe_name, limit=10, skip=0}) {
	return getApi('/recipe/search', {recipe_name, limit, skip})
}

// 推荐
export function getRecommendRecipeDaily({force_change = false}) {
	return getApi('/recipe/recommendDaily', {force_change})
}