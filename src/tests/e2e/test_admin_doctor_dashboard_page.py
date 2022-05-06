import time
import unittest

from matplotlib.pyplot import fill
from config import *
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC 
from test_utils import *

class AdminDoctorDashboardTests(unittest.TestCase):
    user_email = get_random_email()
    user_email2 = get_random_email()

    def setUp(self):
        self.driver = create_webdriver()
        self.driver.get(base_url)
        self.driver.maximize_window()

    def wait_until_loading(self):
        time.sleep(0.5)
        WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.ID, 'loadingIndicator'))
        )
    
    def wait_until_loaded(self):
        time.sleep(0.5)
        WebDriverWait(self.driver, 10).until(
            EC.invisibility_of_element_located((By.ID, 'loadingIndicator'))
        )
    
    def login_as_admin(self):
        self.driver.get(base_url + 'loginAdmin')
        if self.driver.current_url != base_url + 'admin':
            (email, password) = get_test_admin_credentials()
            fill_form(self.driver, 'submitBtn', {
                'email-input': email,
                'password-input': password,
            })
            self.wait_until_loading()
            self.wait_until_loaded()
    
    def add_new_doctor(self):
        self.driver.find_element(By.ID, 'addNewDoctorBtn').click()
        email = AdminDoctorDashboardTests.user_email
        fill_form(self.driver, 'submitBtn', {
            'firstNameInput': 'Selenium',
            'lastNameInput': 'Selenium',
            'emailInput': email,
            'passwordInput': 'test',
            'passwordRepeatedInput': 'test',
        })
        self.wait_until_loaded()

    def add_new_doctor_with_bad_data(self, bad_value_id, bad_value):
        self.driver.find_element(By.ID, 'addNewDoctorBtn').click()
        email = AdminDoctorDashboardTests.user_email
        values = {
            'firstNameInput': 'Selenium',
            'lastNameInput': 'Selenium',
            'emailInput': email,
            'passwordInput': 'test',
            'passwordRepeatedInput': 'test',
        }
        values[bad_value_id] = bad_value
        fill_form(self.driver, 'submitBtn', values)
        self.wait_until_loaded()

    def find_doctor_row(self, email):
        rows = self.driver.find_elements(By.TAG_NAME, 'tr')
        for row in rows:
            columns = row.find_elements(By.TAG_NAME, 'td')
            if len(columns) == 4 and columns[2].text == email:
                return row
        return None

    def modify_doctor(self, doctor_row):
        doctor_row.find_element(By.CLASS_NAME, 'modifyBtn').click()
        new_email = AdminDoctorDashboardTests.user_email2
        fill_edit_form(self.driver, 'submitBtn', {
            'email': new_email
        })
        self.wait_until_loaded()

    def delete_doctor(self, doctor_row):
        deleteButton = doctor_row.find_element(By.CLASS_NAME, 'deleteBtn')
        deleteButton.click()
        self.wait_until_loaded()
    
    def go_to_last_visible_page(self):
        self.driver.execute_script('window.scrollBy(0, 10000)', '')
        links = self.driver.find_elements(By.CLASS_NAME, 'page-link')
        items = self.driver.find_elements(By.CLASS_NAME, 'page-item')
        last_page_index = len(links) - 2
        last_page_link = links[last_page_index]
        new_page = last_page_link.text
        time.sleep(1)
        WebDriverWait(self.driver, 12).until(
            EC.element_to_be_clickable(last_page_link)
        ).click()
        self.wait_until_loaded()
        return new_page

    def go_to_last_page(self):
        current_page = '0'
        new_current_page = '1'
        while current_page != new_current_page:
            current_page = new_current_page
            new_current_page = self.go_to_last_visible_page()

    def check_add_doctor_validation(self, bad_value_id, bad_value):
        self.login_as_admin()
        self.add_new_doctor_with_bad_data(bad_value_id, bad_value)
        submitBtn = self.driver.find_elements(By.ID, 'submitBtn')
        self.assertNotEqual(submitBtn, None)
    
    def test_1_add_doctor(self):
        self.login_as_admin()
        self.add_new_doctor()
        self.go_to_last_page()
        row = self.find_doctor_row(AdminDoctorDashboardTests.user_email)
        self.assertNotEqual(row, None)
    
    def test_2_modify_doctor(self):
        self.login_as_admin()
        self.go_to_last_page()
        row = self.find_doctor_row(AdminDoctorDashboardTests.user_email)
        new_email = self.modify_doctor(row)
        row = self.find_doctor_row(AdminDoctorDashboardTests.user_email2)
        self.assertNotEqual(row, None)

    def test_3_delete_doctor(self):
        self.login_as_admin()
        self.go_to_last_page()
        row = self.find_doctor_row(AdminDoctorDashboardTests.user_email2)
        self.delete_doctor(row)
        row = self.find_doctor_row(AdminDoctorDashboardTests.user_email2)
        self.assertEqual(row, None)

    def test_4_email_validation(self):
        self.check_add_doctor_validation('emailInput', 'notAnEmail')

    def test_5_email_validation(self):
        self.check_add_doctor_validation('passwordInput', 'notTheSame')

    def tearDown(self):
        self.driver.get(base_url + 'admin')
        self.driver.find_element(By.ID, 'signOutBtn').click()
        time.sleep(1)
        self.driver.quit()


if __name__ == '__main__':
    unittest.main()