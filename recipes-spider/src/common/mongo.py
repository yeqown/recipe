# set mongo conn and prepare some functions for using.
# define MongoColl or other something

from pymongo.collection import Collection
from pymongo import ReadPreference
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

_Mongo = {
    "recipe": {
        "host": "localhost",
        "port": 27017,
        "maxPoolSize": 1000,
        "tz_aware": True,
        "socketTimeoutMS": None,
        "connectTimeoutMS": 1000,
        "w": 1,
        "wtimeout": 10000,
        "j": False,
        "name": "recipe",
        "auth": None,
        "replicaSet": None,
        "read_preference": ReadPreference.PRIMARY
    },
}

_mongo_databases = {}

def get_mongo_database(alias):
    if alias not in _mongo_databases:
        params = _Mongo[alias]
        name = params.pop("name")
        auth = params.pop("auth", None)
        _mongo_databases[alias] = MongoClient(**params)[name]
        if auth:
            _mongo_databases[alias].authenticate(**auth)
    return _mongo_databases[alias]


class Model(Collection):
    """docstring for RecipeDetail"""
    _fields = None

    def __init__(self, arg):
        super(RecipeDetail, self).__init__()
        self.arg = arg

    def __init__(self, *args, **kwrags):
        super().__init__(*args, **kwrags)
        if self._fields:
            self._fields.update({
                "_id": (ObjectId, False),
                "create_time": (datetime, False),
                "update_time": (datetime, False)
            })

    def create(self, doc_or_docs):
        if isinstance(doc_or_docs, dict):
            self._filter_none_value(doc_or_docs)
            self._validate(doc_or_docs)
            if "create_time" not in doc_or_docs:
                doc_or_docs["create_time"] = datetime.utcnow()
            if "update_time" not in doc_or_docs:
                doc_or_docs["update_time"] = doc_or_docs["create_time"]
            ret = super().insert_one(doc_or_docs)
            return ret.inserted_id

        elif isinstance(doc_or_docs, list):
            for v in doc_or_docs:
                self._filter_none_value(v)
                self._validate(v)
                if "create_time" not in v:
                    v["create_time"] = datetime.utcnow()
                if "create_time" not in v:
                    v["update_time"] = v["create_time"]
            ret = super().insert_many(doc_or_docs)
            return ret.inserted_ids

    @staticmethod
    def _filter_none_value(doc):
        if not isinstance(doc, dict):
            raise Exception("doc should be a dict")

        for k, v in list(doc.items()):
            if v is None:
                del doc[k]

        return doc

    @classmethod
    def _validate(cls, doc, required=True):
        if cls._fields is None:
            return

    def find_by_ids(self, ids, keep_order=True):
        if not ids:
            return []

        docs = list(self.find({"_id": {"$in": ids}}))

        if keep_order:
            d = {v["_id"]: v for v in docs}
            docs = [d.get(v) for v in ids]

        return docs


class RecipeCategory(Model):

    _fields = {
        "name": (str, True),
    }

    def __init__(self, *args, **kwargs):
        super().__init__(get_mongo_database("recipe"), "recipe_category", **kwargs)


class RecipeDetail(Model):

    _fields = {
        "name": (str, True),
        "img": (str, True),
        "cat": (str, True),
        "view_cnt": (int, True),
        "mark_cnt": (int, True),
        "steps": (list, True),
        "material": (dict, True),
        "tip": (str, False),
    }

    def __init__(self, *args, **kwargs):
        super().__init__(get_mongo_database("recipe"), "recipe_detail", **kwargs)
