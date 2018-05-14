# test common package
# 

from common.recipe_url import RecipeUrl

def test():
    ru = RecipeUrl("https://baidu.com", visited=False, cat="川菜")
    print(ru.key())
    print(ru._dump())
    ru.save()

if __name__ == "__main__":
    test()