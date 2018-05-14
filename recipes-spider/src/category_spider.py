import time
from urllib.parse import unquote
from common.recipe_url import put_category_into_queue
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException

# hide chrome window
option = webdriver.ChromeOptions()
option.add_argument('headless')

# new driver object
browser = webdriver.Chrome(chrome_options=option)

is_end = False


def _crawl_cat():
    '''
    cral all category from `http://www.douguo.com/caipu/fenlei`
    '''

    # cats = []
    browser.get("http://www.douguo.com/caipu/fenlei")

    try:
        _kbi_ele = browser.find_element_by_id('ddd2')
        for _a in _kbi_ele.find_elements_by_tag_name('a'):
            # print(_a.get_attribute('class'))
            if _a.get_attribute('class') == "":
                _url = unquote(_a.get_attribute('href'))
                _cat_name = _a.text if _a.text != "" else _url.split('/')[-1]
                _category = {
                    "link": _url,
                    "name": _cat_name,
                    "visiting": False,
                }
                # cats.append(_category)
                print(_category)
                put_category_into_queue(_category)
    except NoSuchElementException as e:
        print("NoSuchElementException: ", e)
    except Exception as e:
        browser.quit()
        raise e
    browser.quit()

if __name__ == "__main__":
    _crawl_cat()
    print("crawing all cats done")
