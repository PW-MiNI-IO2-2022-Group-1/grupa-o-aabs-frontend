import React, {useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import {registerPatient} from "../logic/patientApi";
import "./RegisterPatient.css"
import RegisterPatientForm, {RegistrationData} from "../components/RegisterPatientForm";

export default function RegisterPatientPage() {

    const [show, setShow] = useState(false)
    const [modalMsg, setModalMsg] = useState("")

    const onSubmit = (data: RegistrationData) => {
        console.log(data);
        registerPatient(data)
            .then((response) => {
                handleShow("New patient added!")
                console.log(response)
            })
            .catch((reason) => {
                switch (reason.status) {
                    case 409:
                        handleShow(reason.body.msg)
                        break;
                    case 422:
                        handleShow("Validation error")
                }
            })
    }

    const handleClose = () => setShow(false);
    const handleShow = (msg: string) => {
        setModalMsg(msg)
        setShow(true);
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMsg}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        OK
                    </Button>
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