import time
import unittest

from matplotlib.pyplot import fill
from config import *
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC 
from test_utils import *

class EditPatientDetailsTests(unittest.TestCase):
    def setUp(self):
        self.driver = create_webdriver()
        self.driver.get(base_url)
        self.driver.maximize_window()

    def check_change_data(self, id, new_value):
        login_as_patient(self.driver)
        self.driver.get(base_url + 'patient/editDetails')
        fill_edit_form(self.driver, 'submitBtn', { id: new_value })
        WebDriverWait(self.driver, 5).until(
            EC.visibility_of_element_located((By.ID, 'modal'))
        )

        self.driver.get(base_url + 'patient')
        self.driver.find_element(By.ID, 'signOutBtn').click()
        WebDriverWait(self.driver, 5).until(
            EC.url_to_be(base_url)
        )
        login_as_patient(self.driver)

        self.driver.get(base_url + 'patient/editDetails')
        input_field = self.driver.find_element(By.ID, id)
        self.assertEqual(input_field.get_attribute('value'), new_value)
    
    def test_change_first_name(self):
        self.check_change_data('firstName', get_random_name())

    def test_change_last_name(self):
        self.check_change_data('lastName', get_random_name())

    def test_change_city(self):
        self.check_change_data('city', get_random_name())

    def test_change_street(self):
        self.check_change_data('street', get_random_name())

    def test_change_house_number(self):
        self.check_change_data('houseNumber', get_random_string_number(2))

    def test_change_local_number(self):
        self.check_change_data('localNumber', get_random_string_number(2))

    def test_change_zip_code(self):
        zip_code = get_random_string_number(2) + '-' + get_random_string_number(3)
        self.check_change_data('zipCode', zip_code)

    def tearDown(self):
        self.driver.get(base_url + 'patient')
        self.driver.find_element(By.ID, 'signOutBtn').click()
        time.sleep(1)
        self.driver.quit()


if __name__ == '__main__':
    unittest.main()
