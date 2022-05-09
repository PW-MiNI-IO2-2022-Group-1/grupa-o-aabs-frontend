import { Patient } from '../types/users';
import { useAuth } from '../components/AuthComponents';
import { editPatientDetails } from '../logic/patientApi';
import { useNavigate } from 'react-router';
import { logOut } from '../logic/login';
import { EditPatientDetailsData } from '../types/patientAPITypes';
import { Container } from 'react-bootstrap';
import EditPatientDetailsForm from "../components/forms/EditPatientDetailsForm";
import { useSimpleModal } from '../components/modals/useSimpleModal';
import { UnauthorizedRequestError } from '../types/requestErrors';

export interface PatientDetailsFormData {
    firstName?: string;
    lastName?: string;
    password?: string;
    city?: string;
    zipCode?: string;
    street?: string;
    houseNumber?: string;
    localNumber?: string;
}

function convertFormDataToApiData(formData: PatientDetailsFormData): EditPatientDetailsData {
    return {
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        address: {
            city: formData.city,
            zipCode: formData.zipCode,
            street: formData.street,
            houseNumber: formData.houseNumber,
            localNumber: formData.localNumber
        }
    }
}

function calculateFormDifference(initialFormData: PatientDetailsFormData,
                                 formData: PatientDetailsFormData): PatientDetailsFormData {
    let data: PatientDetailsFormData = {};

    for(let key in initialFormData)
        if((formData as any)[key] !== (initialFormData as any)[key])
            (data as any)[key] = (formData as any)[key];

    return data;
}

export default function EditPatientDetailsPage(): JSX.Element {
    const auth = useAuth();
    const navigate = useNavigate();
    const patient: Patient = auth.user as Patient;
    const initialValues = {
        firstName: patient.firstName ?? undefined,
        lastName: patient.lastName ?? undefined,
        password: undefined,
        city: patient.address.city ?? undefined,
        zipCode: patient.address.zipCode ?? undefined,
        street: patient.address.street ?? undefined,
        houseNumber: patient.address.houseNumber ?? undefined,
        localNumber: patient.address.localNumber ?? undefined
    };
    const [showModal, renderModal] = useSimpleModal();

    const handleSubmit = (values: PatientDetailsFormData) => {
        const diff = calculateFormDifference(initialValues, values);
        const apiData: EditPatientDetailsData = convertFormDataToApiData(diff);
        editPatientDetails(auth, apiData).then(() => {
            showModal('Success', 'Your account details were successfully changed', () => {
                navigate('/patient');
            });
        }).catch((reason) => {
            if(reason instanceof UnauthorizedRequestError) {
                showModal('Error', 'You are not authorized', () => {
                    logOut(auth);
                });
            } else {
                showModal('Error', 'Unexpected error')
            }
        });

    }

    return (<>
        {renderModal()}
        <Container fluid className='text-center'>Patient details
            <div className='gap'/>
            <EditPatientDetailsForm onSubmit={handleSubmit} initialValues={initialValues}/>
        </Container>
    </>); 
}
