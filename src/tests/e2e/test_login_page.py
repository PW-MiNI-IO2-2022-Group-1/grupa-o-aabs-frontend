import unittest
from config import *
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from test_utils import *
import time

class LoginPageTests(unittest.TestCase):
    def setUp(self):
        self.driver = create_webdriver()
        self.driver.get(base_url)
        self.driver.maximize_window()
    
    def login(self, loginPageUrl, expectedUrl, email, password):
        self.driver.get(base_url + loginPageUrl)
        fill_form(self.driver, 'submitBtn', {
            'email-input': email,
            'password-input': password
        })
        time.sleep(1)
        self.assertEqual(self.driver.current_url, base_url + expectedUrl)
        self.driver.find_element(By.ID, 'signOutBtn').click()
        self.assertEqual(self.driver.current_url, base_url)
    
    def login_error(self, loginPageUrl, email, password):
        self.driver.get(base_url + loginPageUrl)
        fill_form(self.driver, 'submitBtn', {
            'email-input': email,
            'password-input': password
        })
        time.sleep(1)
        self.assertEqual(self.driver.current_url, base_url + loginPageUrl)
        modal = self.driver.find_element(By.ID, 'modal')
        self.assertNotEqual(modal, None)

    def test_patient_login(self):
        (email, password) = get_test_patient_credentials()
        self.login('loginPatient', 'patient', email, password)

    def test_doctor_login(self):
        (email, password) = get_test_doctor_credentials()
        self.login('loginDoctor', 'doctor', email, password)

    def test_admin_login(self):
        (email, password) = get_test_admin_credentials()
        self.login('loginAdmin', 'admin', email, password)

    def test_patient_login_error(self):
        self.login_error('loginPatient', 'test123@noaccount.com', 'badpass')

    def test_doctor_login_error(self):
        self.login_error('loginDoctor', 'test123@noaccount.com', 'badpass')

    def test_admin_login_error(self):
        self.login_error('loginAdmin', 'test123@noaccount.com', 'badpass')

    def tearDown(self):
        self.driver.quit()


if __name__ == '__main__':
    unittest.main()