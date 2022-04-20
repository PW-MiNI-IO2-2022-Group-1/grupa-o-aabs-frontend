import { RegistrationData } from "../components/forms/RegisterPatientForm";
import { AuthContextType } from "../types/auth";
import { EditPatientDetailsData } from "../types/patientAPITypes";
import { Patient, Role } from "../types/users";
import { BASE_URL } from './config';
import { StatusCodes } from 'http-status-codes';
import { UnauthorizedRequestError } from '../types/requestErrors';
import { Timeslot, Vaccine, validDiseases } from "../types/vaccination";

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
            auth.modifyState((state) => {
                state.role = Role.Patient;
                state.user = patient;
                return {...state};
            });
    });
}

export function getAvailableVaccines(auth: AuthContextType): Promise<Vaccine[]> {
    const diseasesQuery: string = [...validDiseases].join(',');

    return fetch(`${BASE_URL}/patient/vaccines?disease=${diseasesQuery}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth.token ?? ''
            },
        }).then(response => {
            if(response.ok) return response.json();
            if(response.status === StatusCodes.UNAUTHORIZED)
                throw new UnauthorizedRequestError('You are not authorized');
            throw response;
        }).then((json) => json.vaccines as Vaccine[]);
}

export function getAvailableTimeslots(auth: AuthContextType): Promise<Timeslot[]> {
    return fetch(`${BASE_URL}/patient/vaccination-slots`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth.token ?? ''
            },
        }).then(response => {
            if(response.ok) return response.json();
            if(response.status === StatusCodes.UNAUTHORIZED)
                throw new UnauthorizedRequestError('You are not authorized');
        }).then((json) => (json as any[]).map(x => {
            let d: Date = new Date(x.date);
            return {id: x.id, date: d} as Timeslot;
        }));
}

export function reserveTimeslot(auth: AuthContextType, timeslot: Timeslot,
                                vaccine: Vaccine): Promise<void> {
    console.log(`vaccine-id: ${vaccine.id}     timeslot-id: ${timeslot.id}`);
    return fetch(`${BASE_URL}/patient/vaccination-slots/${timeslot.id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth.token ?? ''
            },
            body: `{"vaccineId": ${vaccine.id}}`
        }).then(response => {
            if(response.ok) return;
            if(response.status === StatusCodes.UNAUTHORIZED)
                throw new UnauthorizedRequestError('You are not authorized');
            throw response;
        });
}