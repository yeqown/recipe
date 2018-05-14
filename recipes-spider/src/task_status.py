import os
import time
from common.mongo import RecipeDetail

if __name__ == "__main__":
	while True:
		os.system("clear")
		time.sleep(5)
		print("current recipes total: ", RecipeDetail().count())