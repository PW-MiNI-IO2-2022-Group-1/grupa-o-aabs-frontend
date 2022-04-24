import { StatusCodes } from "http-status-codes";
import { AuthState } from "../types/auth";
import { UnauthorizedRequestError } from "../types/unauthorizedRequestError";
import { BASE_URL } from "./config";
import { Pagination } from '../types/pagination';
import { Doctor } from "../types/users";
import { AddDoctorForm } from "../components/useAddDoctorModal";
import { NewDoctorData } from "../types/adminAPITypes";

const doctorsPerPage = 20;

export function getDoctors(auth: AuthState, page: number): Promise<[Doctor[], Pagination]> {
    return fetch(`${BASE_URL}/admin/doctors?page=${page.toString()}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth.token ?? ''
            }
        }).then(response => {
            if(response.ok) return response.json();
            if(response.status === StatusCodes.UNAUTHORIZED)
                throw new UnauthorizedRequestError('You are not authorized');
            throw response;
        }).then(json => {
            const pagination: Pagination = json.pagination;
            const doctors: Doctor[] = json.data;
            return [doctors, pagination];
        });
}

export function deleteDoctor(auth: AuthState, doctor: Doctor): Promise<void> {
    return fetch(`${BASE_URL}/admin/doctors/${doctor.id.toString()}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth.token ?? ''
            }
        }).then(response => {
            if(response.ok) return;
            if(response.status === StatusCodes.UNAUTHORIZED)
                throw new UnauthorizedRequestError('You are not authorized');
            throw response;
        });
}

export function editDoctor(auth: AuthState, doctor: Doctor): Promise<void> {
    return fetch(`${BASE_URL}/admin/doctors/${doctor.id.toString()}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth.token ?? ''
            },
            body: `{"firstName":"${doctor.firstName}","lastName":"${doctor.lastName}","email":"${doctor.email}"}`
        }).then(response => {
            if(response.ok) return;
            if(response.status === StatusCodes.UNAUTHORIZED)
                throw new UnauthorizedRequestError('You are not authorized');
            throw response;
        });
}

export function createDoctor(auth: AuthState, doctorData: NewDoctorData): Promise<void> {
    return fetch(`${BASE_URL}/admin/doctors`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth.token ?? ''
            },
            body: JSON.stringify(doctorData)
        } 
    ).then(response => {
        if(response.ok) return;
        if(response.status === StatusCodes.UNAUTHORIZED)
            throw new UnauthorizedRequestError('You are not authorized');
        throw response;
    })
}