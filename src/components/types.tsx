export type DoctorScheduleForm = {
    week: Date,
    monSlots: TimeSlot[],
    tueSlots: TimeSlot[],
    wedSlots: TimeSlot[],
    thuSlots: TimeSlot[],
    friSlots: TimeSlot[],
    satSlots: TimeSlot[],
    sunSlots: TimeSlot[]
};
export type TimeSlot = {
    beginning: {
        hour: string;
        minute: string;
    },
    end: {
        hour: string;
        minute: string;
    },
}
export type Visit = {
    date: Date;
    id: number;
    vaccination: Vaccination;
}
export type Vaccination = {
    id: number;
    vaccine: Vaccine
    status: "Planned" | ""
    patient: Patient
}
export type Vaccine = {
    id: number;
    name: string;
    disease: string;
    requiredDoses: number;
}
export type Patient = {
    id: number;
    firstName: string;
    lastName: string;
    pesel: string;
    email: string;
    address: Address;
}
export type Address = {
    id: number;
    city: string;
    zipCode: string;
    street: string;
    houseNumber: number;
    localNumber: string;
}
export type Pagination = {
    currentPage: number;
    totalPages: number;
    currentRecord: number;
    totalRecords: number;
}