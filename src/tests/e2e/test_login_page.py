import unittest
from config import *
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import time

class LoginPageTests(unittest.TestCase):
    def setUp(self):
        self.driver = create_webdriver()
        self.driver.get(base_url)
        self.driver.maximize_window()
    
    def login(self, loginPageUrl, expectedUrl, email, password):
        self.driver.get(base_url + loginPageUrl)
        self.driver.find_element(By.ID, 'email-input').send_keys(email)
        self.driver.find_element(By.ID, 'password-input').send_keys(password)
        self.driver.find_element(By.ID, 'submitBtn').click()
        time.sleep(1)
        self.assertEqual(self.driver.current_url, base_url + expectedUrl)
        self.driver.find_element(By.ID, 'signOutBtn').click()
        self.assertEqual(self.driver.current_url, base_url)
    
    def login_error(self, loginPageUrl, email, password):
        self.driver.get(base_url + loginPageUrl)
        self.driver.find_element(By.ID, 'email-input').send_keys(email)
        self.driver.find_element(By.ID, 'password-input').send_keys(password)
        with self.assertRaises(NoSuchElementException):
            self.driver.find_element(By.ID, 'modal')

        self.driver.find_element(By.ID, 'submitBtn').click()
        time.sleep(1)
        self.assertEqual(self.driver.current_url, base_url + loginPageUrl)
        modal = self.driver.find_element(By.ID, 'modal')
        self.assertNotEqual(modal, None)

    def test_patient_login(self):
        self.login('loginPatient', 'patient', 'test3@test.com', 'test')

    def test_doctor_login(self):
        self.login('loginDoctor', 'doctor', 'test@test.com', 'test')

    def test_admin_login(self):
        self.login('loginAdmin', 'admin', 'test@test.com', 'test')

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