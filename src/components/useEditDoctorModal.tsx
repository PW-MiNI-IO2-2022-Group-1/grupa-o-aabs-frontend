import { useFormik } from "formik";
import { useState } from "react";
import { Button, Container, Modal, Row} from "react-bootstrap";
import { Doctor } from "../types/users";
import * as Yup from 'yup'
import { EditField } from "./EditField";
import DoctorDashboard from "../pages/DoctorDashboard";

interface EditDoctorModalState {
    isVisible: boolean;
    doctor: Doctor | undefined;
    callback: ((doctor: Doctor) => void) | undefined;
}

interface EditDoctorForm {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export function useEditDoctorModal(): [(doctor: Doctor, 
    editCallback: (doctor: Doctor) => void) => void, () => JSX.Element] {
    const [state, setState] = useState<EditDoctorModalState>({
        isVisible: false,
        doctor: undefined,
        callback: undefined
    });

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().min(2, 'First name is required')
        .matches(RegExp(/[A-Z].+/g), "First name has to start with uppercase letter"),
        lastName: Yup.string().min(2, 'Last name is required')
        .matches(RegExp(/[A-Z].+/g), "Last name has to start with uppercase letter"),
        email: Yup.string().matches(RegExp(/^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/), 'Email is invalid')
    });

    const form = useFormik<EditDoctorForm>({
        initialValues: {
            firstName: undefined,
            lastName: undefined,
            email: undefined
        },
        validationSchema: validationSchema,
        onSubmit: (values: EditDoctorForm) => { }
    });

    const closeModal = () => {
        setState((state) => {
            state.isVisible = false;
            return {...state};
        });
    }

    const showModal = (doctor: Doctor,
            editCallback: (doctor: Doctor) => void) => {
        setState((state) => {
            state.isVisible = true;
            state.doctor = doctor;
            state.callback = editCallback;
            return {...state};
        });
        form.setValues({
            'firstName': doctor.firstName,
            'lastName': doctor.lastName,
            'email': doctor.email
        });
    }

    const onClose = () => {
        if(form.isValid) {
            closeModal();
            if(state.callback !== undefined && state.doctor !== undefined) {
                const newDoctor: Doctor = {
                    id: state.doctor.id,
                    firstName: form.values.firstName ?? state.doctor.firstName,
                    lastName: form.values.lastName ?? state.doctor.lastName,
                    email: form.values.email ?? state.doctor.email,
                };
                state.callback(newDoctor);
            }
        }
    }

    const renderModal = () => {
        return <Modal show={state.isVisible} onHide={closeModal}
               backdrop='static'>
            <Modal.Header>
                <Modal.Title>Edit doctor</Modal.Title>     
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <form>
                        <EditField key='firstName' valueKey='firstName'
                            displayName='First name' values={form.values}
                            handleChange={form.handleChange}
                            error={form.errors.firstName}
                            type='text'/>
                        <EditField key='lastName' valueKey='lastName'
                            displayName='Last name' values={form.values}
                            handleChange={form.handleChange}
                            error={form.errors.lastName}
                            type='text'/>
                        <EditField key='email' valueKey='email'
                            displayName='Email' values={form.values}
                            handleChange={form.handleChange}
                            error={form.errors.email}
                            type='text'/>
                    </form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={closeModal}>
                    Cancel
                </Button>
                <Button variant='primary' onClick={onClose}>
                    Edit
                </Button>
            </Modal.Footer>
        </Modal>
    }

    return [showModal, renderModal];
}