import {RegistrationData} from "../components/RegisterPatientForm";

import { BASE_URL } from './config';

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