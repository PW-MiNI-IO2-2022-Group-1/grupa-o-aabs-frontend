from selenium import webdriver

base_url: str = 'http://localhost:3000/'

def create_webdriver():
    return webdriver.Chrome()

