package main

import (
	"flag"
	"github.com/yeqown/gweb"
	. "github.com/yeqown/gweb/logger"
	"net/http"

	ctr "recipes-server/controllers"
	"recipes-server/models"
)

var (
	db_conf     = flag.String("db_conf", "./configs/config.db.json", "-db_conf filename")
	server_conf = flag.String("server_conf", "./configs/config.server.json", "-server_conf filename")
)

func main() {
	flag.Parse()

	if err := loadDBConf(*db_conf); err != nil {
		AppL.Fatal(err.Error())
	}

	if err := loadServerConf(*server_conf); err != nil {
		AppL.Fatal(err.Error())
	}

	models.ConnectMongo(db_ins.MgoC)
	// models.ConnectMysql(db_ins.MysqlC)
	// models.ConnectRedis(db_ins.RedisC)

	registerHttpRoutes()
	gweb.StartHttpServer(server_ins.HttpC)
}

func registerHttpRoutes() {
	gweb.AddRoute(
		&gweb.Route{"/recipe/cnt", http.MethodGet, ctr.RecipeCountGet,
			ctr.PoolRecipeCntForm,
			ctr.PoolRecipeCntResp,
		})
	gweb.AddRoute(
		&gweb.Route{"/recipe/category", http.MethodGet, ctr.GetRecipeCategories,
			ctr.PoolGetRecipeCategoriesForm,
			ctr.PoolGetRecipeCategoriesResp,
		})
	gweb.AddRoute(
		&gweb.Route{"/recipe/detail", http.MethodGet, ctr.GetRecipeDetail,
			ctr.PoolGetRecipeDetailForm,
			ctr.PoolGetRecipeDetailResp,
		})
	gweb.AddRoute(
		&gweb.Route{"/recipe/listByCat", http.MethodGet, ctr.GetRecipeByCat,
			ctr.PoolGetRecipeByCatForm,
			ctr.PoolGetRecipeByCatResp,
		})

	// 每日推荐
	gweb.AddRoute(
		&gweb.Route{"/recipe/recommendDaily", http.MethodGet, ctr.RecipeRecommendGet,
			ctr.PoolRecipeRecommendForm,
			ctr.PoolRecipeRecommendResp,
		})

	// 每日搜索
	gweb.AddRoute(
		&gweb.Route{"/recipe/search", http.MethodGet, ctr.RecipeSearchGet,
			ctr.PoolRecipeSearchForm,
			ctr.PoolRecipeSearchResp,
		})
}
