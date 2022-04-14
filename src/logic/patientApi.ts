import {RegistrationData} from "../components/RegisterPatientForm";
import { AuthContextType } from "../types/auth";
import { BASE_URL } from './config';
import { StatusCodes } from 'http-status-codes';
import { UnauthorizedRequestError } from "../types/unauthorizedRequestError";
import { Timeslot, Vaccine, validDiseases } from "../types/vaccination";
import { response } from "msw";

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
            if(response.status == StatusCodes.UNAUTHORIZED)
                throw new UnauthorizedRequestError('You are not authorized');
        }).then((json) => (json as any[]).map(x => {
            let d: Date = new Date(x.date);
            return <Timeslot>{id: x.id, date: d};
        }));
}

export function reserveTimeslot(auth: AuthContextType, timeslot: Timeslot,
                                vaccine: Vaccine): Promise<void> {
    console.log(`vaccine-id: ${vaccine.id}     timeslot-id: ${timeslot.id}`);
    return fetch(`${BASE_URL}/patient/vaccination-slots/${timeslot.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth.token ?? ""
            },
            body: `{"vaccineId": ${vaccine.id}}`
        }).then(response => {
            console.log(response);
            if(response.ok) return;
            if(response.status == StatusCodes.UNAUTHORIZED)
                throw new UnauthorizedRequestError('You are not authorized');
            throw response;
        });
}