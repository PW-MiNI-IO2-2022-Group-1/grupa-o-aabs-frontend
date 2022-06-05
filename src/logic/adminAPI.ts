import { AuthState } from "../types/auth";
import { BASE_URL } from "./config";
import { Pagination } from '../types/pagination';
import { Doctor } from "../types/users";
import {NewDoctorData, ReportDisease} from "../types/adminAPITypes";
import moment from "moment";
import {checkStatusAndGetBody, checkStatusAndIgnoreBody, apiGet, apiPut, apiDelete, apiPost, apiGetPdf} from "./API";
import {Vaccination} from "../types/vaccination";

export function getDoctors(auth: AuthState, page: number): Promise<[Doctor[], Pagination]> {
    return apiGet(`${BASE_URL}/admin/doctors?page=${page.toString()}`, auth)
           .then(checkStatusAndGetBody)
           .then((json) => {
            const pagination: Pagination = json.pagination;
            const doctors: Doctor[] = json.data;
            return [doctors, pagination];
        });
}

export function deleteDoctor(auth: AuthState, doctor: Doctor): Promise<void> {
    return apiDelete(`${BASE_URL}/admin/doctors/${doctor.id.toString()}`, auth)
           .then(checkStatusAndIgnoreBody);
}

export function editDoctor(auth: AuthState, doctor: Doctor): Promise<void> {
    return apiPut(`${BASE_URL}/admin/doctors/${doctor.id.toString()}`, auth,
            `{"firstName":"${doctor.firstName}","lastName":"${doctor.lastName}","email":"${doctor.email}"}`)
        .then(checkStatusAndIgnoreBody);
}

export function createDoctor(auth: AuthState, doctorData: NewDoctorData): Promise<void> {
    return apiPost(`${BASE_URL}/admin/doctors`, auth, 
                    JSON.stringify(doctorData))
           .then(checkStatusAndIgnoreBody)
}

export function getReportData(auth: AuthState, start: Date, end: Date): Promise<ReportDisease[]> {
    start = start === null? new Date('1990-01-01') : start;
    end = end === null? new Date() : end;
        start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    let sDate = encodeURIComponent(start.toISOString());
    let eDate = encodeURIComponent(end.toISOString());
    return apiGet(`${BASE_URL}/admin/vaccinations/report?startDate=${sDate}&endDate=${eDate}`,auth)
        .then(checkStatusAndGetBody)
        .then((json) => {
            return json.diseases;
        });
}

export function downloadReport(auth: AuthState, start: Date, end: Date): Promise<void> {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    let sDate = encodeURIComponent(start.toISOString());
    let eDate = encodeURIComponent(end.toISOString());
    let name = `${moment(start).format("YYYY-MM-DD")}_to_${moment(end).format("YYYY-MM-DD")}_vaccinations_report.pdf`
    return apiGetPdf(`${BASE_URL}/admin/vaccinations/report/download?startDate=${sDate}&endDate=${eDate}`,auth, name)

export function getVaccinations(auth: AuthState,
                                doctorId: number | null,
                                patientId: number | null,
                                page: number | null,
                                disease: string | null) {
    let url = `${BASE_URL}/admin/vaccinations`
    let isFirst = true
    if(doctorId !== null){
        url += `${isFirst? '?' : '&'}doctorId=${doctorId}`
        isFirst = false
    }
    if(patientId !== null){
        url += `${isFirst? '?' : '&'}patientId=${patientId}`
        isFirst = false
    }
    if(disease !== null){
        url += `${isFirst? '?' : '&'}disease=${disease}`
        isFirst = false
    }
    if(page !== null){
        url += `${isFirst? '?' : '&'}page=${page}`
    }

    return apiGet(url, auth).then(checkStatusAndGetBody)
}