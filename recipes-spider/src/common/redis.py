# for redis conn and prepare some base functions
# default set local redis

import redis
from redis import StrictRedis


_pool = redis.ConnectionPool(
    host="localhost",
    port=6379,
    decode_responses=True
)

_pool_db2 = redis.ConnectionPool(
    host="localhost",
    port=6379,
    decode_responses=True,
    db=2
)


def get_redis_conn():
    '''get_redis_conn'''
    return redis.Redis(connection_pool=_pool)


class Cache(StrictRedis):

    def __init__(self):
        super().__init__(connection_pool=_pool)

    def key(self):
        raise NotImplementedError

    def is_in(self, obj):
        return self.sismember(self.key(), obj)

    def put(self, obj_or_objs):
        if isinstance(obj_or_objs, (list)):
            self.sadd(self.key(), *obj_or_objs)
        else:
            self.sadd(self.key(), obj_or_objs)

    def pop(self):
        return self.spop(self.key())


class RecipeDetailQueuing(Cache):

    def key(self):
        return "recipe:detail:queuing"


class RecipeDetailDone(Cache):

    def key(self):
        return "recipe:detail:done"


class RecipeCategoryQueuing(Cache):

    def key(self):
        return "recipe:category:queuing"

class RecipeCategoryDone(Cache):

    def key(self):
        return "recipe:category:done"
