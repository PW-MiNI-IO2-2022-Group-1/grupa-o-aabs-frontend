import unittest
from config import *
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from test_utils import *

class LoginPageTests(unittest.TestCase):
    def setUp(self):
        self.driver = create_webdriver()
        self.driver.get(base_url)
        self.driver.maximize_window()
    
    def test_patient_login(self):
        login_as_patient(self.driver)
        self.assertEqual(self.driver.current_url, base_url + 'patient')

    def test_doctor_login(self):
        login_as_doctor(self.driver)
        self.assertEqual(self.driver.current_url, base_url + 'doctor')

    def test_admin_login(self):
        login_as_admin(self.driver)
        self.assertEqual(self.driver.current_url, base_url + 'admin')

    def test_patient_login_error(self):
        login_as_patient_fail(self.driver, 'test123@noaccount.com', 'badpass')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_doctor_login_error(self):
        login_as_doctor_fail(self.driver, 'test123@noaccount.com', 'badpass')
        self.assertNotEqual(self.driver.current_url, base_url + 'doctor')

    def test_admin_login_error(self):
        login_as_admin_fail(self.driver, 'test123@noaccount.com', 'badpass')
        self.assertNotEqual(self.driver.current_url, base_url + 'admin')

    def tearDown(self):
        self.driver.quit()


if __name__ == '__main__':
    unittest.main()