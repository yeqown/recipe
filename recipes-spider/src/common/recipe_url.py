# RecipeUrl to define some common functions
# * key()
# * val()
# * save_to_redis()
#

from .util import encode_url
from .redis import RecipeDetailQueuing, RecipeCategoryQueuing, RecipeDetailDone, RecipeCategoryDone
from json import dumps, loads


def put_category_into_queue(cat):
    s = dumps(cat)
    RecipeCategoryQueuing().put(s)


def put_category_into_done(cat):
    s = dumps(cat)
    RecipeCategoryDone().put(s)


def put_detail_into_queue(detail):
    s = dumps(detail)
    RecipeDetailQueuing().put(s)


def put_detail_into_done(detail):
    s = dumps(detail)
    RecipeDetailDone().put(s)


def pop_category_from_queue():
    cat = RecipeCategoryQueuing().pop()
    if not cat:
        return None
    return loads(cat)


def pop_detail_from_queue():
    detail = RecipeDetailQueuing().pop()
    if not detail:
        return None
    return loads(detail)


# class RecipeCategory(object):

#     def __init__(self, cat_url, cat_name, visiting):
#         self.cat_url = cat_url
#         self.cat_name = cat_name
#         self.visiting = visiting

#     def key(self):
#         return encode_url(self._dump())

#     def _dump(self):
#         return dumps({
#             "cat_url": self.cat_url,
#             "visited": self.visited,
#             "cat": self.cat
#         })

#     def save(self):
#         key = self.key()
#         val = self._dump()
#         get_redis_conn().set(key, val)

#     def load(self, s):
#         _d = loads(s)
#         self.cat_url = _d["cat_url"]
#         self.visited = _d["visited"]
#         self.cat = _d["cat"]
#         return _d


# class RecipeUrl(object):

#     def __init__(self, url="", visited=False, cat=None):
#         self.url = url
#         self.visited = visited
#         self.cat = cat if cat else "未分类"

#     def key(self):
#         return encode_url(self._dump())

#     def _dump(self):
#         return dumps({
#             "url": self.url,
#             "visited": self.visited,
#             "cat": self.cat
#         })

#     def save(self):
#         key = self.key()
#         val = self._dump()
#         get_redis_conn().set(key, val)

#     def load(self, s):
#         _d = loads(s)
#         self.url = _d["url"]
#         self.visited = _d["visited"]
#         self.cat = _d["cat"]
#         return _d
