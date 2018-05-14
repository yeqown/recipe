# Recipe detail spider support multi-process
# get Recipe detail data from on page format like:
# `http://www.douguo.com/cookbook/699488.html`

# data = {
#   "name": "name",
#   "cost": "45Min",
#   "pic_link": "...",
#   "view_cnt": 123,
#   "mark_cnt": 1231,
#   "material": {
#       "ingredients": [
#           {
#               "name": "name",
#               "weight": "500g",
#           },
#           //...
#       ],
#       "seasoning": {
#           {
#               "name": "name",
#               "weight": "500g",
#           },
#           //...
#       }
#   },
#   "steps": [
#       "aaaaa",
#       "bbbbb",
#       //...
#   ],
#   tip: "tip is here"
# }


# import os
# import json
# import time
# from common.util import wash_string

from common.mongo import RecipeDetail
from common.recipe_url import pop_detail_from_queue, put_detail_into_queue, put_detail_into_done
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException


# hide chrome window
option = webdriver.ChromeOptions()
option.add_argument('headless')

# new driver object
browser = webdriver.Chrome(chrome_options=option)


def _crawl_recipe_detail_from_url_by_webd(_url):
    browser.get(_url)
    print('crawling {}'.format(_url))
    try:
        _recinfo_ele = browser.find_element_by_css_selector("div.recinfo")
        _name_elem_ = _recinfo_ele.find_element_by_id('page_cm_id')
        # print(_name_elem_.text)
        name = _name_elem_.text
        _img_ele = _recinfo_ele.find_element_by_css_selector(
            'div.bokpic').find_element_by_tag_name('img')
        img = _img_ele.get_attribute('src')
        view_cnt = _recinfo_ele.find_element_by_css_selector(
            'span.collectview').text
        mark_cnt = _recinfo_ele.find_element_by_css_selector(
            'span.collectnum').text
        # matrial
        _tbody_ele = _recinfo_ele.find_element_by_tag_name("tbody")
        ingredients = []
        seasoning = []
        _ingredients_flag = False
        for _tr in _tbody_ele.find_elements_by_tag_name('tr'):
            if _tr.text == "":
                continue
            if _tr.get_attribute('class') == "mtim":
                _ingredients_flag = not _ingredients_flag
                continue

            # print("{0}".format(_tr.text))

            for _td in _tr.find_elements_by_tag_name('td'):
                # skip empty td
                if _td.text == "":
                    continue
                _name = _td.find_element_by_tag_name('span').text
                _weight = _td.find_element_by_css_selector('span.right').text
                if _ingredients_flag:
                    ingredients.append({"name": _name, "weight": _weight})
                    continue
                seasoning.append({"name": _name, "weight": _weight})

        # steps
        steps = []
        _steps_ele = _recinfo_ele.find_element_by_css_selector("div.step")
        for _step_ele in _steps_ele.find_elements_by_css_selector('div.stepcont'):
            _img = _step_ele.find_element_by_tag_name(
                'img').get_attribute('original')
            _desc = _step_ele.find_element_by_tag_name("p").text
            steps.append({"img": _img, "desc": _desc})

        # tip text can be empty
        tip = ""
        try:
            _tip_ele = _recinfo_ele.find_element_by_css_selector("div.xtieshi")
            tip = _tip_ele.find_element_by_tag_name('p').text
        except NoSuchElementException as e:
            print("cur recipe no tip")

    except NoSuchElementException as e:
        print("element not found: ", e)
        return None
    except Exception as e:
        raise e

    # final
    recipe = {
        "name": name,
        "img": img,
        "view_cnt": view_cnt,
        "mark_cnt": mark_cnt,
        "material": {
            "ingredients": ingredients,
            "seasoning": seasoning,
        },
        "steps": steps,
        "tip": tip,
    }
    return recipe


def _save_recipe_detail_into_db(recipe_detail):
    '''
        _save_recipe_detail_into_db
        @recipe_detail is an object format like up data
    '''
    # print(recipe_detail)
    RecipeDetail().create(recipe_detail)


def test():
    # _url = http://www.douguo.com/cookbook/1669178.html
    # _url = http://www.douguo.com/cookbook/699488.html
    # _url = "http://www.douguo.com/cookbook/1669178.html"
    _url = "http://www.douguo.com/cookbook/1375786.html"
    recipe = _crawl_recipe_detail_from_url_by_webd(_url)
    if not recipe:
        raise Exception('Recipe got None')
    # print(recipe)
    _save_recipe_detail_into_db(recipe)


def main():
    '''
    get url link from redis cache
    '''
    while True:
        detail = pop_detail_from_queue()
        if not detail:
            break

        try:
            recipe_detail = _crawl_recipe_detail_from_url_by_webd(detail[
                                                                  'url'])
            recipe_detail['cat'] = detail['cat']
            _save_recipe_detail_into_db(recipe_detail)
        except Exception as e:
            print(e)
            put_detail_into_queue(detail)
            continue
        detail['visited'] = True
        put_detail_into_done(detail)
        print("{} finished".format(detail['url']))

if __name__ == "__main__":
    # test()
    try:
        main()
        browser.quit()
    except Exception as e:
        browser.quit()
