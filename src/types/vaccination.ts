import { Doctor, Patient } from './users';

export type Visit = {
    date: Date;
    id: number;
    vaccination: Vaccination | null;
}

export type Timeslot = {
    id: number;
    date: Date;
}

export type Vaccination = {
    id: number;
    vaccine: Vaccine
    status: 'Planned' | 'Completed' | 'Canceled'
    patient: Patient | null
}

export type PatientVaccination = {
    id: number;
    vaccine: Vaccine;
    vaccinationSlot: Timeslot;
    status: 'Planned' | 'Completed' | 'Canceled';
    patient: Patient;
    doctor: Doctor;
}

export const validDiseases: readonly string[] = [
    'COVID-19',
    'COVID-21',
    'Flu',
    'OTHER'
];

export type Vaccine = {
    id: number;
    name: string;
    disease: string;
    requiredDoses: number;
}