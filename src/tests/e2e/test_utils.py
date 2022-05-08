import random
from config import *
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC 

def get_random_string_number(n: int):
    return ''.join(chr(random.randint(ord('0'), ord('9'))) for _ in range(n))

def get_random_name(seed: int = None):
    if seed != None:
        random.seed(seed)
    return 'Selenium' + get_random_string_number(3)

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

def login_as(driver, login_url, expected_url, email, password):
    driver.get(base_url + login_url)
    if driver.current_url != base_url + expected_url:
        fill_form(driver, 'submitBtn', {
            'email-input': email,
            'password-input': password,
        })
        WebDriverWait(driver, 5).until(
            EC.url_to_be(base_url + expected_url)
        )

def login_as_patient(driver, email = None, password = None):
    if email == None:
        (email, password) = get_test_patient_credentials()
    login_as(driver, 'loginPatient', 'patient', email, password)

def login_as_doctor(driver, email = None, password = None):
    if email == None:
        (email, password) = get_test_doctor_credentials()
    login_as(driver, 'loginDoctor', 'doctor', email, password)

def login_as_admin(driver, email = None, password = None):
    if email == None:
        (email, password) = get_test_admin_credentials()
    login_as(driver, 'loginAdmin', 'admin', email, password)

def login_as_fail(driver, login_url, expected_url, email, password):
    driver.get(base_url + login_url)
    if driver.current_url != base_url + expected_url:
        fill_form(driver, 'submitBtn', {
            'email-input': email,
            'password-input': password,
        })
        WebDriverWait(driver, 5).until(EC.any_of(
            EC.visibility_of_element_located((By.ID, 'modal')),
            EC.visibility_of_any_elements_located((By.CLASS_NAME, 'is-invalid'))
        ))

def login_as_patient_fail(driver, email = None, password = None):
    if email == None:
        (email, password) = get_test_patient_credentials()
    login_as_fail(driver, 'loginPatient', 'patient', email, password)

def login_as_doctor_fail(driver, email = None, password = None):
    if email == None:
        (email, password) = get_test_doctor_credentials()
    login_as_fail(driver, 'loginDoctor', 'doctor', email, password)

def login_as_admin_fail(driver, email = None, password = None):
    if email == None:
        (email, password) = get_test_admin_credentials()
    login_as_fail(driver, 'loginAdmin', 'admin', email, password)


   