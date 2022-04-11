import { addSyntheticLeadingComment } from "typescript";
import { RegistrationData } from "../components/RegisterPatientForm";
import { AuthContextType } from "../types/auth";
import { EditPatientDetailsData } from "../types/patientAPITypes";
import { Patient, Role } from "../types/users";
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

export function editPatientDetails(auth: AuthContextType, 
                                   data: EditPatientDetailsData) {
    return fetch(`${BASE_URL}/patient/account`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth.token ?? '',
            },
            body: JSON.stringify(data)
        }).then((response): Promise<Patient> => {
            if(response.ok)
                return response.json();
            throw response;
        }).then((patient) => {
            auth.user = patient;
            auth.role = Role.Patient;
        });
}