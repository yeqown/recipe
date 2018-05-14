# Recipe list spider
# get recipe list from `www.douguo.com`

# import os
# import json
# import time
# from common.util import wash_string

import time
from urllib.parse import unquote
from common.recipe_url import pop_category_from_queue, put_detail_into_queue, put_category_into_done
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException

# hide chrome window
option = webdriver.ChromeOptions()
option.add_argument('headless')

# new driver object
browser = webdriver.Chrome(chrome_options=option)

# golbal to mark one cat_nameegory crawl done
is_last_page = False


def _crawl_recipe_list_of_one_cat(cat, page):
    global is_last_page

    # make url
    _url = cat['link']
    if _url == "":
        _url = "http://www.douguo.com/caipu/{cat}".format(cat['name'])
    if page:
        _url += "/{}".format((page - 1) * 30)

    browser.get(_url)

    print("crawling {}, and current page: {}".format(_url, page))

    try:
        # to judge page end
        pagination = browser.find_element_by_css_selector('div.page_PN')
        _pagers_ele = pagination.find_element_by_css_selector('div.pagination')

        # print("下一页" in _pagers_ele.text)
        is_last_page = "下一页" not in _pagers_ele.text
        # print("the last page", is_last_page)

        # get list
        _container = browser.find_element_by_id('container')

        # print(_container.find_elements_by_css_selector('div.cp_box'))
        for _ele in _container.find_elements_by_css_selector('div.cp_box'):
            link = _ele.find_element_by_tag_name('a').get_attribute('href')
            print(link)
            # save into redis with cat
            put_detail_into_queue({"url": link, "visited": False, "cat": cat['name']})

    except NoSuchElementException as e:
        print("crawling {} err: {}".format(_url, e))
        is_last_page = True
        # record it
    except Exception as e:
        raise e


def test():
    # _crawl_recipe_list_of_one_cat("川菜", 0)
    cat = {
        "name": "川菜",
        "link": "http://www.douguo.com/caipu/川菜",
    }
    _crawl_recipe_list_of_one_cat(cat, 133)


def main():
    global is_last_page
    while True:
        # TODO: get one cat from redis cache
        cat = pop_category_from_queue()
        if not cat:
            break
        page = 1
        print("crawling category: {}".format(cat['name']))
        while not is_last_page:
            print("the last page", is_last_page)
            _crawl_recipe_list_of_one_cat(cat, page)
            page += 1

        print("crawling category: {} done !!".format(cat['name']))
        put_category_into_done(cat)
        is_last_page = False

    print("no more category")

if __name__ == "__main__":
    # test()
    try:
        main()
        browser.quit()
    except Exception as e:
        print(e)
        browser.quit()
