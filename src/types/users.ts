export enum Role {
    Patient = "patient",
    Doctor = "doctor",
    Admin = "admin"
}

export type User = {
    id: number;

    email: string;

    firstName: string;
    lastName: string;
}

export type Doctor = User

export type Admin = User 

export type Address = {
    id: number;
    city: string;
    zipCode: string;
    street: string;
    houseNumber: string;
    localNumber: string | null;
}

export type Patient = User & {
    pesel: string;
    address: Address;
}