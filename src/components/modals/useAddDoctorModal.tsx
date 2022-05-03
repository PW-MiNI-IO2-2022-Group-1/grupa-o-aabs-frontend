import { useFormik } from "formik";
import { fromPairs } from "lodash";
import { useState } from "react";
import { Button, Container, Modal, Row} from "react-bootstrap";
import * as Yup from 'yup'
import { NewDoctorData } from "../../types/adminAPITypes";

interface AddDoctorModalState {
    isVisible: boolean;
    callback: ((doctor: NewDoctorData) => void) | undefined;
}

export interface AddDoctorForm {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    passwordRepeated?: string;
}

export function useAddDoctorModal(): [(callback: (doctor: NewDoctorData) => void) => void,
                                       () => JSX.Element] {
    const [state, setState] = useState<AddDoctorModalState>({
        isVisible: false,
        callback: undefined
    });

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().min(2, 'First name is required')
        .matches(RegExp(/[A-Z].+/g), 'First name has to start with uppercase letter'),
        lastName: Yup.string().min(2, 'Last name is required')
        .matches(RegExp(/[A-Z].+/g), 'Last name has to start with uppercase letter'),
        email: Yup.string().email('Valid email is required'),
        password: Yup.string().min(1, 'Password is required'),
        passwordRepeated: Yup.string().oneOf([Yup.ref('password')], 'Passwords do not match')
    });

    const form = useFormik<AddDoctorForm>({
        initialValues: { },
        validationSchema: validationSchema,
        onSubmit: (values: AddDoctorForm) => { }
    });

    const closeModal = () => {
        setState((state) => {
            form.resetForm();
            state.isVisible = false;
            return {...state};
        });
    }

    const isFormFilled = (): boolean => {
        for(let key in form.values) {
            const value = (form.values as any)[key];
            if(value === undefined || value === '')
                return false;
        }
        return true;
    }

    const showModal = (editCallback: (doctor: NewDoctorData) => void) => {
        setState((state) => {
            state.isVisible = true;
            state.callback = editCallback;
            return {...state};
        });
    }

    const onSubmit = () => {
        if(form.isValid && isFormFilled()) {
            closeModal();
            if(state.callback !== undefined) {
                const doctorData: NewDoctorData = {
                    firstName: form.values.firstName!,
                    lastName: form.values.lastName!,
                    email: form.values.email!,
                    password: form.values.password!
                }
                state.callback(doctorData);
            }
        }
    }

    const renderInput = (key: string, displayName: string, type: string,
            placeholder?: string) => {
        const error = (form.errors as any)[key];
        const value = (form.values as any)[key];
        return (<>
            <label className='form-label text-sm-start'>{displayName}</label>
            <input
                name={key}
                value={value}
                type={type}
                placeholder={placeholder ?? ''}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                onChange={form.handleChange}
            />
            {error ?
                <div className='invalidfeedback text-sm-center text-small' id={key + 'error'}>{error}</div>:
                <div className='gap'/>}
        </>);

    }

    const renderModal = () => {
        return <Modal show={state.isVisible} onHide={closeModal}
               backdrop='static'>
            <Modal.Header>
                <Modal.Title>Add patient</Modal.Title>     
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <form>
                        {renderInput('firstName', 'First name', 'text', 'John')}
                        {renderInput('lastName', 'Last name', 'text', 'Doe')}
                        {renderInput('email', 'Email', 'text', 'john@doe.com')}
                        {renderInput('password', 'Password', 'password')}
                        {renderInput('passwordRepeated', 'Repeat password', 'password')}
                    </form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={closeModal}>
                    Cancel
                </Button>
                <Button variant='primary' onClick={onSubmit}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    }

    return [showModal, renderModal];
}