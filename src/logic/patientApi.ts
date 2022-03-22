import {RegistrationData} from "../pages/RegisterPatient";

const BASE_URL = 'http://Sopsaabsbackend-develop.eba-jjsphgrc.us-east-1.elasticbeanstalk.com';

export function registerPatient(registrationData: RegistrationData) {
    return fetch(`${BASE_URL}/patient/registration`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData)
        }).then(response => {
        if (response.ok) return response.json()
        throw response;
    })
}