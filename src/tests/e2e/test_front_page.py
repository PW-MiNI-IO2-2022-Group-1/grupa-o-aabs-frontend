import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By

class FrontPage(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get('http://localhost:3000/')
        self.driver.implicitly_wait(3)
        self.driver.maximize_window()

    def check_redirection(self, element_id, expected_url):
        self.driver.find_element(By.ID, element_id)
        self.driver.find_element_by_id(element_id).click()
        self.assertEqual(self.driver.current_url,
                        'http://localhost:3000/' + expected_url)

    def test_go_to_patient_login_page(self):
        self.check_redirection('loginPatientPageBtn', 'loginPatient')

    def test_go_to_doctor_login_page(self):
        self.check_redirection('loginDoctorPageBtn', 'loginDoctor')

    def test_go_to_admin_login_page(self):
        self.check_redirection('loginAdminPageBtn', 'loginAdmin')

    def test_go_to_registration_page(self):
        self.check_redirection('registerPatientPageBtn', 'patient/register')

    def tearDown(self):
        self.driver.quit()


if __name__ == '__main__':
    unittest.main()