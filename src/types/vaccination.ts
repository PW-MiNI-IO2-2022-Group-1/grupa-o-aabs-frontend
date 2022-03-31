import { Patient } from './users';

export type Visit = {
    date: Date;
    id: number;
    vaccination: Vaccination | null;
}

export type Vaccination = {
    id: number;
    vaccine: Vaccine
    status: 'Planned' | 'Completed' | 'Canceled'
    patient: Patient | null
}

export type Vaccine = {
    id: number;
    name: string;
    disease: string;
    requiredDoses: number;
}

