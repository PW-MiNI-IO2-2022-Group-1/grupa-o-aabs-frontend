import { AuthState } from "../types/auth";
import { BASE_URL } from "./config";
import { Pagination } from '../types/pagination';
import {Doctor, Patient} from "../types/users";
import { NewDoctorData } from "../types/adminAPITypes";
import { checkStatusAndGetBody, checkStatusAndIgnoreBody, apiGet, apiPut, apiDelete, apiPost } from "./API";

export function getDoctors(auth: AuthState, page: number): Promise<[Doctor[], Pagination]> {
    return apiGet(`${BASE_URL}/admin/doctors?page=${page.toString()}`, auth)
           .then(checkStatusAndGetBody)
           .then((json) => {
            const pagination: Pagination = json.pagination;
            const doctors: Doctor[] = json.data;
            return [doctors, pagination];
        });
}

export function getPatients(auth: AuthState, page: number): Promise<[Patient[], Pagination]> {
    return apiGet(`${BASE_URL}/admin/patients?page=${page.toString()}`, auth)
        .then(checkStatusAndGetBody)
        .then((json) => {
            const pagination: Pagination = json.pagination;
            const patients: Patient[] = json.data;
            return [patients, pagination];
        });
}

export function deleteDoctor(auth: AuthState, doctor: Doctor): Promise<void> {
    return apiDelete(`${BASE_URL}/admin/doctors/${doctor.id.toString()}`, auth)
           .then(checkStatusAndIgnoreBody);
}

export function deletePatient(auth: AuthState, patient: Patient): Promise<void> {
    return apiDelete(`${BASE_URL}/admin/patients/${patient.id.toString()}`, auth)
        .then(checkStatusAndIgnoreBody);
}

export function editDoctor(auth: AuthState, doctor: Doctor): Promise<void> {
    return apiPut(`${BASE_URL}/admin/doctors/${doctor.id.toString()}`, auth,
            `{"firstName":"${doctor.firstName}","lastName":"${doctor.lastName}","email":"${doctor.email}"}`)
        .then(checkStatusAndIgnoreBody);
}

export function editPatient(auth: AuthState, patient: Patient): Promise<void> {
    return apiPut(`${BASE_URL}/admin/patients/${patient.id.toString()}`, auth,
        `{"firstName":"${patient.firstName}","lastName":"${patient.lastName}","email":"${patient.email}",
        "pesel":"${patient.pesel}", "address": {"city": "${patient.address.city}","zipCode": "${patient.address.zipCode}",
        "street":"${patient.address.street}","houseNumber": "${patient.address.houseNumber}",
        "localNumber": "${patient.address.localNumber}"}}`)
        .then(checkStatusAndIgnoreBody);
}

export function createDoctor(auth: AuthState, doctorData: NewDoctorData): Promise<void> {
    return apiPost(`${BASE_URL}/admin/doctors`, auth,
        JSON.stringify(doctorData))
        .then(checkStatusAndIgnoreBody)
}