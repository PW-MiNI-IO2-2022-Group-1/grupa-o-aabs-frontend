import React, {useState} from 'react';
import {Button, Col, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";
import {registerPatient} from "../logic/patientApi";
import {SubmitHandler, useForm} from "react-hook-form";
import "./RegisterPatient.css"

export interface Address {
    city: string
    zipCode: string
    street: string
    houseNumber: string
    localNumber: string
}

export interface RegistrationData {
    firstName: string
    lastName: string
    pesel: string
    email: string
    password: string
    address: Address
}

export default function RegisterPatient() {

    const {register, handleSubmit, watch, formState: {errors}, getValues} = useForm<RegistrationData>();
    const [show, setShow] = useState(false)
    const [modalMsg, setModalMsg] = useState("")

    const onSubmit: SubmitHandler<RegistrationData> = data => {
        console.log(data);
        // registerPatient(data)
        //     .then((response) => {
        //         handleShow("New patient added!")
        //         console.log(response)
        //     })
        //     .catch((reason) => {
        //         switch (reason.status) {
        //             case 409:
        //                 handleShow(reason.body.msg)
        //                 break;
        //             case 422:
        //                 handleShow("Validation error")
        //         }
        //     })
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
                <Form
                    className="text-start"
                    onSubmit={handleSubmit(onSubmit)}>

                    <h2 className="mt-4">
                        Login data
                    </h2>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>
                            E-mail address
                        </Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="example@domain.com"
                            {...register("email", {
                                required: true
                            })}
                        />
                    </Form.Group>
                    <Row>
                        <Form.Group as={Col} md="6">
                            <Form.Label>
                                Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder=""
                                {...register("password", {
                                    required: true
                                })}
                            />
                        </Form.Group>

                        {/*<Form.Group as={Col} md="6">*/}
                        {/*    <Form.Label>*/}
                        {/*        Repeat password*/}
                        {/*    </Form.Label>*/}
                        {/*    <Form.Control*/}
                        {/*        type="password"*/}
                        {/*        placeholder=""*/}
                        {/*        {...register("", {*/}
                        {/*            validate: value => value === getValues("password")*/}
                        {/*        })}*/}
                        {/*    />*/}
                        {/*</Form.Group>*/}
                    </Row>
                    <h2 className="mt-4">
                        Personal data
                    </h2>
                    <Row>
                        <Form.Group as={Col} md="4">
                            <Form.Label>
                                First name
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="First Name"
                                {...register("firstName", {
                                    required: true
                                })}
                            />
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                            <Form.Label>
                                Last name
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Last Name"
                                {...register("lastName", {
                                    required: true
                                })}/>
                        </Form.Group>

                        {/*Tutaj może ewentualnie zmienić, aby były takie placeholdery na cyfry*/}
                        <Form.Group as={Col} md="4">
                            <Form.Label>
                                PESEL
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Pesel"
                                {...register("pesel", {
                                    //dodać regexp sprawdzający pesel
                                    pattern: /[0-9]{11}/
                                })}/>
                        </Form.Group>
                    </Row>

                    <h3 className="mt-4">
                        Address
                    </h3>
                    <Row>
                        <Form.Group as={Col} md="6">
                            <Form.Label>
                                City
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="City"
                                {...register("address.city", {
                                    required: true
                                })}
                            />
                        </Form.Group>

                        {/*Tutaj może ewentualnie zmienić, aby były takie placeholdery na cyfry*/}
                        <Form.Group as={Col} md="6">
                            <Form.Label>
                                Zip code
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="00-000"
                                {...register("address.zipCode", {
                                    pattern: /[0-9]{2}-[0-9]{3}/
                                })}/>
                        </Form.Group>


                    </Row>
                    <Row>
                        <Form.Group as={Col} md="4">
                            <Form.Label>
                                Street
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Street"
                                {...register("address.street", {
                                    required: true
                                })}/>
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                            <Form.Label>
                                House number
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="House number"
                                {...register("address.houseNumber", {
                                    required: true
                                })}/>
                        </Form.Group>

                        <Form.Group as={Col} md="4">
                            <Form.Label>
                                Local number
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Local Number"
                                {...register("address.localNumber", {
                                    required: true
                                })}/>
                        </Form.Group>
                    </Row>
                    <Button
                        className="mt-4"
                        variant="primary" type="submit">
                        Register
                    </Button>
                </Form>
            </div>
        </>


    )
}