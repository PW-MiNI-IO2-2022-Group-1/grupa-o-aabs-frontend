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
