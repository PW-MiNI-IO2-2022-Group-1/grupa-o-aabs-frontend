import React, {useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import {registerPatient} from "../logic/patientApi";
import "./RegisterPatient.css"
import RegisterPatientForm, {RegistrationData} from "../components/RegisterPatientForm";
import {useNavigate} from "react-router-dom";

export default function RegisterPatientPage() {

    const [show, setShow] = useState(false)
    const [modalMsg, setModalMsg] = useState("")
    const [success, setSuccess] = useState(false)
    //const navigate = useNavigate()

    const onSubmit = (data: RegistrationData) => {
        registerPatient(data)
            .then((response) => {
                handleShow(true, "New patient added!")
                console.log(response)
            })
            .catch((reason) => {
                // jak się dostać do body resona? Zwraca mi że jest undefined
                switch (reason.status) {
                    case 409:
                        handleShow(false, reason.body ?
                            reason.body.msg : 'Specified email or pesel already exists')
                        break;
                    case 422:
                        handleShow(false, "Validation error")
                        break;
                    default:
                        handleShow(false, "Unknown error")
                        break;
                }
            })
    }

    const handleClose = () => setShow(false);
    const handleShow = (success: boolean, msg: string) => {
        setModalMsg(msg)
        setSuccess(success)
        setShow(true);
    }

    const navigateLogin = () => {
        //navigate("/loginPatient")
        console.log("navigate to /loginPatient")
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header>
                    <Modal.Title>{success ? "Success" : "Error"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMsg}</Modal.Body>
                <Modal.Footer>
                    {
                        success
                            ? <Button variant="primary" onClick={navigateLogin}>
                                Login
                            </Button>
                            : <Button variant="primary" onClick={handleClose}>
                                OK
                            </Button>
                    }
                </Modal.Footer>
            </Modal>
            <div className="registerForm">
                <h1>
                    Register patient
                </h1>
                <RegisterPatientForm onSubmit={onSubmit}/>
            </div>
        </>


    )
}