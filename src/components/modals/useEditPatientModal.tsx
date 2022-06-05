import { useFormik } from "formik";
import { useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import {Patient} from "../../types/users";
import * as Yup from 'yup'
import EditField from "../EditField";

interface EditPatientModalState {
    isVisible: boolean;
    patient: Patient | undefined;
    callback: ((patient: Patient) => void) | undefined;
}

export interface EditPatientForm {
    firstName?: string;
    lastName?: string;
    pesel?: string;
    email?: string;
    city?: string;
    zipCode?: string;
    street?: string;
    houseNumber?: string;
    localNumber?: string | null;
}

export function useEditPatientModal(): [(patient: Patient,
                                        editCallback: (user: Patient) => void) => void, () => JSX.Element] {
    const [state, setState] = useState<EditPatientModalState>({
        isVisible: false,
        patient: undefined,
        callback: undefined
    });

    const patientValidationSchema = Yup.object().shape({
        firstName: Yup.string().min(2, 'First name is required')
            .matches(RegExp(/[A-Z].+/g), "First name has to start with uppercase letter"),
        lastName: Yup.string().min(2, 'Last name is required')
            .matches(RegExp(/[A-Z].+/g), "Last name has to start with uppercase letter"),
        pesel: Yup.string().matches(RegExp(/^[0-9]{11}$/)),
        email: Yup.string().matches(RegExp(/^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/), 'Email is invalid'),
        city: Yup.string().min(2, 'City is required')
            .matches(RegExp(/[A-Z].+/g), "City has to start with uppercase letter"),
        zipCode: Yup.string().matches(RegExp(/^[0-9]{2}-[0-9]{3}$/), "Zip code format: XX-XXX"),
        street: Yup.string().min(2, 'Street is required'),
        houseNumber: Yup.string().min(2, 'House number is required'),
    });

    const patientForm = useFormik<EditPatientForm>({
        initialValues: { },
        validationSchema: patientValidationSchema,
        onSubmit: (values: EditPatientForm) => { }
    });

    const closeModal = () => {
        setState((state) => {
            state.isVisible = false;
            return {...state};
        });
    }

    const showModal = (patient: Patient,
                       editCallback: (patient: Patient) => void) => {
        setState((state) => {
            state.isVisible = true;
            state.patient = patient;
            state.callback = editCallback;
            return {...state};
        });
        patientForm.setValues({
            'firstName': patient.firstName,
            'lastName': patient.lastName,
            'pesel': patient.pesel,
            'email': patient.email,
            'city': patient.address.city,
            'zipCode': patient.address.zipCode,
            'street': patient.address.street,
            'houseNumber': patient.address.houseNumber,
            'localNumber': patient.address.localNumber
        });
    }

    const onSubmit = () => {
        if(patientForm.isValid) {
            closeModal();
            if(state.callback !== undefined && state.patient !== undefined) {
                const newPatient: Patient = {
                    id: state.patient.id,
                    firstName: patientForm.values.firstName ?? state.patient.firstName,
                    lastName: patientForm.values.lastName ?? state.patient.lastName,
                    email: patientForm.values.email ?? state.patient.email,
                    pesel: patientForm.values.pesel ?? state.patient.pesel,
                    address: {
                        id: state.patient.address.id,
                        city: state.patient.address.city,
                        street: state.patient.address.street,
                        zipCode: state.patient.address.zipCode,
                        houseNumber: state.patient.address.houseNumber,
                        localNumber: state.patient.address.localNumber,
                    }
                };
                state.callback(newPatient);
            }
        }
    }

    const renderPatientForm = () => {
        return (
            <form>
                <EditField key='firstName' valueKey='firstName'
                           displayName='First name' values={patientForm.values}
                           handleChange={patientForm.handleChange}
                           error={patientForm.errors.firstName}
                           type='text'/>
                <EditField key='lastName' valueKey='lastName'
                           displayName='Last name' values={patientForm.values}
                           handleChange={patientForm.handleChange}
                           error={patientForm.errors.lastName}
                           type='text'/>
                <EditField key='pesel' valueKey='pesel'
                           displayName='PESEL' values={patientForm.values}
                           handleChange={patientForm.handleChange}
                           error={patientForm.errors.pesel}
                           type='text'/>
                <EditField key='email' valueKey='email'
                           displayName='Email' values={patientForm.values}
                           handleChange={patientForm.handleChange}
                           error={patientForm.errors.email}
                           type='text'/>
                <EditField key='city' valueKey='city'
                           displayName='City' values={patientForm.values}
                           handleChange={patientForm.handleChange}
                           error={patientForm.errors.city}
                           type='text'/>
                <EditField key='zipCode' valueKey='zipCode'
                           displayName='Zip code' values={patientForm.values}
                           handleChange={patientForm.handleChange}
                           error={patientForm.errors.zipCode}
                           type='text'/>
                <EditField key='street' valueKey='street'
                           displayName='Street' values={patientForm.values}
                           handleChange={patientForm.handleChange}
                           error={patientForm.errors.street}
                           type='text'/>
                <EditField key='houseNumber' valueKey='houseNumber'
                           displayName='House number' values={patientForm.values}
                           handleChange={patientForm.handleChange}
                           error={patientForm.errors.houseNumber}
                           type='text'/>
                <EditField key='localNumber' valueKey='localNumber'
                           displayName='Local number' values={patientForm.values}
                           handleChange={patientForm.handleChange}
                           error={patientForm.errors.localNumber}
                           type='text'/>
            </form>
        )
    }

    const renderModal = () => {
        return <Modal show={state.isVisible} onHide={closeModal}
                      backdrop='static'>
            <Modal.Header>
                <Modal.Title>Edit patient</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    {renderPatientForm()}
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={closeModal}>
                    Cancel
                </Button>
                <Button variant='primary' onClick={onSubmit} id='submitBtn'>
                    Edit
                </Button>
            </Modal.Footer>
        </Modal>
    }

    return [showModal, renderModal];
}