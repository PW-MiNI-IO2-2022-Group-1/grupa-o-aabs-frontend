export type NewDoctorData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type ReportDisease = {
    name: string,
    count: number,
    vaccines: ReportVaccine[],
};

export type ReportVaccine = {
    name: string,
    count: number
}

export type VaccinationFilterData = {
    disease: string | null;
    patientId: number | null;
    doctorId: number | null;
}