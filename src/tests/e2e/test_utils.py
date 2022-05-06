import random
from selenium.webdriver.common.by import By

def get_random_string_number(n: int):
    return ''.join(chr(random.randint(ord('0'), ord('9'))) for _ in range(n))

def get_random_email(seed: int = None):
    if seed != None:
        random.seed(seed)
    return 'user' + get_random_string_number(10) + '@email.com'

def get_random_pesel(seed: int = None):
    if seed != None:
        random.seed(seed)
    return get_random_string_number(11)

def fill_form(driver, submit_btn_id: str, form_data: dict[str, str]):
    for (id, value) in form_data.items():
        driver.find_element(By.ID, id).send_keys(value)
    driver.find_element(By.ID, submit_btn_id).click()

def fill_edit_form(driver, submit_btn_id: str, form_data: dict[str, str]):
    for (id, value) in form_data.items():
        driver.find_element(By.ID, id + 'InputEnabler').click()
        input = driver.find_element(By.ID, id)
        input.clear()
        input.send_keys(value)
    driver.find_element(By.ID, submit_btn_id).click()



   