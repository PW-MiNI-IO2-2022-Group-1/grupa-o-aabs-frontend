import React, { useState } from 'react';
import { Patient } from '../types/users';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { EditField } from '../components/EditField';
import { useAuth } from '../components/AuthComponents';
import { getOrDefault } from '../utils/dictionaryUtils';
import { Button, Modal } from 'react-bootstrap';
import { editPatientDetails } from '../logic/patientApi';
import { useNavigate } from 'react-router';
import { logOut } from '../logic/login';
import { EditPatientDetailsData } from '../types/patientAPITypes';
import { Container, Row, Col} from 'react-bootstrap';

export interface PatientDetailsFormData {
    firstName?: string;
    lastName?: string;
    password?: string;
    city?: string;
    zipCode?: string;
    street?: string;
    houseNumber?: string;
    localNumber?: string;
};

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

    const [show, setShow] = useState(false);
    const [modalMsg, setModalMsg] = useState("");
    const [success, setSuccess] = useState(false);

    const displayNames = new Map<String, String>([
        ['firstName', 'First name'],
        ['lastName', 'Last name'],
        ['password', 'Password'],
        ['city', 'City'],
        ['zipCode', 'Zip code'],
        ['street', 'Street'],
        ['houseNumber', 'House number'],
        ['localNumber', 'Local number'],
    ]);
    const inputTypes = new Map<String, String>();
    inputTypes.set('password', 'password');

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().min(2, 'First name is required')
        .matches(RegExp(/[A-Z].+/g), "First name has to start with uppercase letter"),
        lastName: Yup.string().min(2, 'Last name is required')
        .matches(RegExp(/[A-Z].+/g), "Last name has to start with uppercase letter"),
        city: Yup.string().required('City is required')
        .matches(RegExp(/[A-Z].+/g), "City has to start with uppercase letter"),
        zipCode: Yup.string().required('Zip code is required')
        .matches(RegExp(/\d\d-\d\d\d/g), "Zip code is invalid"),
        street: Yup.string().required('Street is required'),
        houseNumber: Yup.string().required('House number is required'),
        localNumber: Yup.string()
    });

    const form = useFormik<PatientDetailsFormData>({
        initialValues: {
            firstName: patient.firstName ?? undefined,
            lastName: patient.lastName ?? undefined,
            password: undefined,
            city: patient.address.city ?? undefined,
            zipCode: patient.address.zipCode ?? undefined,
            street: patient.address.street ?? undefined,
            houseNumber: patient.address.houseNumber ?? undefined,
            localNumber: patient.address.localNumber ?? undefined
        },
        validationSchema: validationSchema,
        onSubmit: (values) => { }
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const diff = calculateFormDifference(form.initialValues, form.values);
        const apiData: EditPatientDetailsData = convertFormDataToApiData(diff);
        editPatientDetails(auth, apiData).then(() => {
            showMessage(true, 'Your account details were successfully changed');
        }).catch((reason) => {
            switch(reason.status) {
                case 401:
                    alert('You are not authorized');
                    logOut(auth);
                    break;
                default:
                    showMessage(false, 'Unexpected error');
            }
        });
        
    }

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

    const renderEditField = (key: string): JSX.Element => {
        const error = (form.errors as any)[key];
        const displayName = getOrDefault(displayNames, key, '').valueOf();
        const inputType = getOrDefault(inputTypes, key, 'text').valueOf();
        return <EditField key={key} valueKey={key} displayName={displayName}
            values={form.values} handleChange={form.handleChange}
            error={error} type={inputType}/>
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
            <form onSubmit={onSubmit} className='form-container' data-testid='form'
                style={{width: '800px'}}>
                <Row>
                    <Col>{renderEditField('firstName')}</Col>
                    <Col>{renderEditField('lastName')}</Col>
                </Row>
                <Row>
                    <Col>{renderEditField('password')}</Col>
                    <Col/>
                </Row>
                <Row><div style={{height: '50px'}}/></Row>
                <Row>
                    <Col>{renderEditField('city')}</Col>
                    <Col>{renderEditField('zipCode')}</Col>
                </Row>
                <Row>
                    <Col>{renderEditField('street')}</Col>
                    <Col>{renderEditField('houseNumber')}</Col>
                </Row>
                <Row>
                    <Col>{renderEditField('localNumber')}</Col>
                    <Col/>
                </Row>
                <Row><div style={{height: '50px'}}/></Row>
                <Row className='justify-content-center'>
                    <input type='submit' className='btn btn-light btn-outline-dark'
                        style={{width: '150px'}} value='Change details'/>
                </Row>
            </form>
        </Container>
    </>); 
}