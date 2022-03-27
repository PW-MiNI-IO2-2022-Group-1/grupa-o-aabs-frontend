export enum Role {
    Patient = "patient",
    Doctor = "doctor",
    Admin = "admin"
}

class User {
    id: number | undefined;

    email: string | undefined;

    firstName: string | undefined;
    lastName: string | undefined;
}

class Doctor extends User { }

class Admin extends User { }

class Address {
    id: number | undefined;
    city: string | undefined;
    zipCode: string | undefined;
    street: string | undefined;
    houseNumber: string | undefined;
    localNumber: string | undefined;
}

class Patient extends User {
    address: Address;

    constructor() {
        super();
        this.address = new Address();
    }
}

export {User, Address, Doctor, Admin, Patient};