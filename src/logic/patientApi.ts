import { RegistrationData } from "../components/forms/RegisterPatientForm";
import { AuthContextType } from "../types/auth";
import { EditPatientDetailsData } from "../types/patientAPITypes";
import { Patient, Role } from "../types/users";
import { BASE_URL } from './config';
import {Timeslot, Vaccine, validDiseases, Visit} from "../types/vaccination";
import {apiGet, apiGetPdf, apiPost, apiPut, checkStatusAndGetBody, checkStatusAndIgnoreBody} from "./API";
import {StatusCodes} from "http-status-codes";
import {UnauthorizedRequestError} from "../types/requestErrors";

export function registerPatient(registrationData: RegistrationData) {
    return apiPost(`${BASE_URL}/patient/registration`, undefined,
            JSON.stringify(registrationData))
        .then(checkStatusAndGetBody);
}

export function downloadCertificate(auth: AuthContextType, visit: Visit) {
    const id = visit.vaccination!.id;
    const p = visit.vaccination!.patient;
    const name = `${p?.firstName}_${p?.lastName}_${visit.vaccination!.vaccine!.name}_certificate.pdf`
    return apiGetPdf(`${BASE_URL}/patient/vaccinations/${id}/certificate`, auth, name)
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
