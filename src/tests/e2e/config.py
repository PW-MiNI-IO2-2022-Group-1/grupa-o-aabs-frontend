from selenium import webdriver

base_url: str = 'http://localhost:3000/'

def create_webdriver():
    return webdriver.Chrome()

def get_test_patient_credentials():
    return ('testtest@test.com', 'test')

def get_test_doctor_credentials():
    return ('test@test.com', 'test')

def get_test_admin_credentials():
    return ('test@test.com', 'test')

