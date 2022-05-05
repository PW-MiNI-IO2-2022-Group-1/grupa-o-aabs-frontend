import React, { useState } from 'react';
import { Patient } from '../types/users';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useAuth } from '../components/AuthComponents';
import { Button, Modal } from 'react-bootstrap';
import { editPatientDetails } from '../logic/patientApi';
import { useNavigate } from 'react-router';
import { logOut } from '../logic/login';
import { EditPatientDetailsData } from '../types/patientAPITypes';
import { Container } from 'react-bootstrap';
import EditPatientDetailsForm from "../components/forms/EditPatientDetailsForm";
import {initial} from "lodash";

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
    const getFormValuesFromEvent = (e: any) => {
        return {
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            password: e.target.password.value,
            city: e.target.city.value,
            zipCode: e.target.zipCode.value,
            street: e.target.street.value,
            houseNumber: e.target.houseNumber.value,
            localNumber: e.target.localNumber.value,
        }
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const values = getFormValuesFromEvent(e);
        const diff = calculateFormDifference(initialValues, values);
        const apiData: EditPatientDetailsData = convertFormDataToApiData(diff);
        editPatientDetails(auth, apiData).then(() => {
            showMessage(true, 'Your account details were successfully changed');
        }).catch((reason) => {
            switch(reason.status) {
                case 401:
                    alert('You are not authorized');
                    logOut(auth).then(() => navigate('/loginPatient'));
                    break;
                default:
                    showMessage(false, 'Unexpected error');
            }
        });

    }


    const [show, setShow] = useState(false);
    const [modalMsg, setModalMsg] = useState("");
    const [success, setSuccess] = useState(false);


    const closeMessageAndRedirect = () => {
        setShow(false);
        navigate('/patient');
    }
    const closeMessage = () => setShow(false);
    const showMessage = (success: boolean, msg: string) => {
        setModalMsg(msg)
        setSuccess(success)
        setShow(true);
    }

    return (<>
        <Modal show={show} onHide={closeMessage} backdrop="static">
            <Modal.Header>
                <Modal.Title>{success ? "Success" : "Error"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalMsg}</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" 
                    onClick={success ? closeMessageAndRedirect : closeMessage}>
                        OK
                </Button>
            </Modal.Footer>
        </Modal>
        <Container fluid className='text-center'>Patient details
            <div className='gap'/>
            <EditPatientDetailsForm onSubmit={handleSubmit} initialValues={initialValues}/>
        </Container>
    </>); 
}
