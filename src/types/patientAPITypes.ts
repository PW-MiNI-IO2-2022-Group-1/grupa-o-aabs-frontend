export interface EditPatientDetailsData {
    firstName: string | undefined;
    lastName: string | undefined;
    password: string | undefined;
    address: {
        city: string | undefined;
        zipCode: string | undefined;
        street: string | undefined;
        houseNumber: string | undefined;
        localNumber: string | undefined;
    }
};