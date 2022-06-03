import { RegistrationData } from "../components/forms/RegisterPatientForm";
import { AuthContextType } from "../types/auth";
import { EditPatientDetailsData } from "../types/patientAPITypes";
import { Patient, Role } from "../types/users";
import { BASE_URL } from './config';
import { PatientVaccination, Timeslot, Vaccine, validDiseases } from "../types/vaccination";
import { apiGet, apiPost, apiPut, checkStatusAndGetBody, checkStatusAndIgnoreBody } from "./API";
import {StatusCodes} from "http-status-codes";
import {UnauthorizedRequestError} from "../types/requestErrors";

export function registerPatient(registrationData: RegistrationData) {
    return apiPost(`${BASE_URL}/patient/registration`, undefined,
            JSON.stringify(registrationData))
        .then(checkStatusAndGetBody);
}

export function downloadCertificate(auth: AuthContextType, id: number) {
    return fetch(`${BASE_URL}/patient/vaccinations/${id}/certificate`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/pdf',
            'Authorization': auth?.token ?? ''
        }
    }).then((response) => {
        if (response.ok) return response.blob();
        if (response.status === StatusCodes.UNAUTHORIZED)
            throw new UnauthorizedRequestError('You are not authorized');
        throw response;
    }).then(showFile)
}

export function editPatientDetails(auth: AuthContextType, 
                                   data: EditPatientDetailsData) {
    return apiPut(`${BASE_URL}/patient/account`, auth,
            JSON.stringify(data))
        .then(checkStatusAndGetBody)
        .then((patient) => {
            auth.modifyState((state) => {
                state.role = Role.Patient;
                state.user = patient as Patient;
                return {...state};
            });
        }
    );
}

export function getAvailableVaccines(auth: AuthContextType): Promise<Vaccine[]> {
    const diseasesQuery: string = [...validDiseases].join(',');

    return apiGet(`${BASE_URL}/patient/vaccines?disease=${diseasesQuery}`, auth)
        .then(checkStatusAndGetBody)
        .then((json) => json.vaccines as Vaccine[]);
}

export function getAvailableTimeslots(auth: AuthContextType): Promise<Timeslot[]> {
    return apiGet(`${BASE_URL}/vaccination-slots`, auth)
        .then(checkStatusAndGetBody)
        .then((json) => (json as any[]).map(x => {
            let d: Date = new Date(x.date);
            return {id: x.id, date: d} as Timeslot;
        }));
}

export function reserveTimeslot(auth: AuthContextType, timeslot: Timeslot,
                                vaccine: Vaccine): Promise<void> {
    return apiPut(`${BASE_URL}/patient/vaccination-slots/${timeslot.id}`, auth,
            `{"vaccineId": ${vaccine.id}}`)
        .then(checkStatusAndIgnoreBody);
}


export function getVaccinationHistory(auth: AuthContextType, page: number): Promise<[PatientVaccination[], number]> {
    return apiGet(`${BASE_URL}/patient/vaccinations?page=${page}`, auth)
        .then(checkStatusAndGetBody)
        .then((body) => {
            console.log(body);
            const totalPages: number = body.pagination.totalPages as number;
            const vaccinations: PatientVaccination[] = body.data as PatientVaccination[];
            for(let vaccination of vaccinations) {
                vaccination.vaccinationSlot.date 
                    = new Date(vaccination.vaccinationSlot.date);
            }
            return [vaccinations, totalPages];
        });

function showFile(blob: BlobPart){
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    const newBlob = new Blob([blob], {type: "application/pdf"});

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement('a');
    link.href = data;
    link.download="file.pdf";
    link.click();
    setTimeout(function(){
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
    }, 100);
}