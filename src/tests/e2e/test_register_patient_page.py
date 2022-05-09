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
            'formEmail': randEmail,
            'formPassword': 'Selenium',
            'formFirstName': 'Selenium',
            'formLastName': 'Selenium',
            'formPESEL': randPesel,
            'formCity': 'Selenium',
            'formZipCode': '00-000',
            'formStreet': 'Selenium',
            'formHouseNumber': '11',
        }
    
    def click_signout_button(self):
        self.driver.find_element(By.ID, 'signOutBtn').click()

    def register_patient(self, form_data):
        self.driver.get(base_url + 'patient/register')
        fill_form(self.driver, 'submitBtn', form_data)
        return (form_data['formEmail'], form_data['formPassword'])

    def register_page_validation_check(self, id, bad_value):
        form_data = self.get_register_form_data()
        form_data[id] = bad_value
        (email, password) = self.register_patient(form_data)
        WebDriverWait(self.driver, 5).until(
            EC.visibility_of_any_elements_located((By.CLASS_NAME, 'is-invalid'))
        )
        login_as_patient_fail(self.driver, email, password)
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page(self):
        form_data = self.get_register_form_data()
        (email, password) = self.register_patient(form_data)
        WebDriverWait(self.driver, 5).until(
            EC.visibility_of_element_located((By.ID, 'modal'))
        )
        login_as_patient(self.driver, email, password)
        self.assertEqual(self.driver.current_url, base_url + 'patient')
        self.click_signout_button()

    def test_register_page_validation_email(self):
        self.register_page_validation_check('formEmail', 'notAnEmail')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_pesel(self):
        self.register_page_validation_check('formPESEL', '1234')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_zip_code(self):
        self.register_page_validation_check('formZipCode', '1234-1234')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_password(self):
        self.register_page_validation_check('formPassword', '')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_first_name(self):
        self.register_page_validation_check('formFirstName', '')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_last_name(self):
        self.register_page_validation_check('formLastName', '')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_city(self):
        self.register_page_validation_check('formCity', '')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_street(self):
        self.register_page_validation_check('formStreet', '')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def test_register_page_validation_house_number(self):
        self.register_page_validation_check('formHouseNumber', '')
        self.assertNotEqual(self.driver.current_url, base_url + 'patient')

    def tearDown(self):
        self.driver.quit()


if __name__ == '__main__':
    unittest.main()