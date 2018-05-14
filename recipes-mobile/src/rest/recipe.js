import { getApi } from './'

export function getRecipeDetailById({ id }) {
	return getApi('/recipe/detail', {id})
}

export function getRecipeListByCategory({cat, limit=10, skip=0}) {
	return getApi('/recipe/listByCat', {cat, limit, skip})
}

export function getRecipeCategories(){
	return getApi('/recipe/category', {})
}

// export function getRecipeCategories(){
// 	return getApi('/res/banners', {})
// }