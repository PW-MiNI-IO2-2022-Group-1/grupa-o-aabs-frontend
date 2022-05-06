import time
import unittest
from config import *
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from test_utils import *

class RegisterPatientPageTests(unittest.TestCase):
    def setUp(self):
        self.driver = create_webdriver()
        self.driver.get(base_url)
        self.driver.maximize_window()

    def get_register_form_data(self):
        randEmail = get_random_email()
        randPesel = get_random_pesel()
        return {
            'emailInput': randEmail,
            'passwordInput': 'Selenium',
            'firstNameInput': 'Selenium',
            'lastNameInput': 'Selenium',
            'peselInput': randPesel,
            'cityInput': 'Selenium',
            'zipCodeInput': '00-000',
            'streetInput': 'Selenium',
            'houseNumberInput': '11',
        }
    
    def click_signout_button(self):
        self.driver.find_element(By.ID, 'signOutBtn').click()

    def register_patient(self, form_data):
        self.driver.get(base_url + 'patient/register')
        fill_form(self.driver, 'submitBtn', form_data)
        time.sleep(3)
        return (form_data['emailInput'], form_data['passwordInput'])

    def log_in_as_patient(self, email, password):
        self.driver.get(base_url + 'loginPatient')
        fill_form(self.driver, 'submitBtn', {
            'email-input': email,
            'password-input': password
        })
        time.sleep(1)

    def register_page_validation_check(self, id, bad_value):
        form_data = self.get_register_form_data()
        form_data[id] = bad_value
        (email, password) = self.register_patient(form_data)
        with self.assertRaises(NoSuchElementException):
            self.driver.find_element(By.ID, 'modal')
        self.log_in_as_patient(email, password)
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page(self):
        form_data = self.get_register_form_data()
        (email, password) = self.register_patient(form_data)
        self.driver.find_element(By.ID, 'modal')
        self.log_in_as_patient(email, password)
        self.assertEqual(self.driver.current_url, base_url + 'patient')
        self.click_signout_button()

    def test_register_page_validation_email(self):
        self.register_page_validation_check('emailInput', 'notAnEmail')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_pesel(self):
        self.register_page_validation_check('peselInput', '1234')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_zip_code(self):
        self.register_page_validation_check('zipCodeInput', '1234-1234')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_password(self):
        self.register_page_validation_check('passwordInput', '')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_first_name(self):
        self.register_page_validation_check('firstNameInput', '')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_last_name(self):
        self.register_page_validation_check('lastNameInput', '')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_city(self):
        self.register_page_validation_check('cityInput', '')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_street(self):
        self.register_page_validation_check('streetInput', '')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_house_number(self):
        self.register_page_validation_check('houseNumberInput', '')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')


    def tearDown(self):
        self.driver.quit()


if __name__ == '__main__':
    unittest.main()