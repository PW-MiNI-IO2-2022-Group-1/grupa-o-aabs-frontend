import React from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import {SubmitHandler, useForm} from "react-hook-form";

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

export default function RegisterPatientForm(props: { onSubmit: SubmitHandler<RegistrationData> }) {

    const {register, handleSubmit, watch, formState: {errors}, getValues} = useForm<RegistrationData>();

    return (
        <Form
            className="text-start"
            onSubmit={handleSubmit(props.onSubmit)}>

            <h2 className="mt-4">
                Login data
            </h2>

            <Form.Group controlId="formEmail">
                <Form.Label>
                    Email
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
                <Form.Group as={Col} md="6" controlId="formPassword">
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
                <Form.Group as={Col} md="4" controlId="formFirstName">
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

                <Form.Group as={Col} md="4" controlId="formLastName">
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
                <Form.Group as={Col} md="4" controlId="formPESEL">
                    <Form.Label>
                        PESEL
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Pesel"
                        {...register("pesel", {
                            //dodać regexp sprawdzający pesel
                            required: true,
                            pattern: /[0-9]{11}/
                        })}/>
                </Form.Group>
            </Row>

            <h3 className="mt-4">
                Address
            </h3>
            <Row>
                <Form.Group as={Col} md="6" controlId="formCity">
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
                <Form.Group as={Col} md="6" controlId="formZipCode">
                    <Form.Label>
                        Zip code
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="00-000"
                        {...register("address.zipCode", {
                            required: true,
                            pattern: /[0-9]{2}-[0-9]{3}/
                        })}/>
                </Form.Group>


            </Row>
            <Row>
                <Form.Group as={Col} md="4" controlId="formStreet">
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

                <Form.Group as={Col} md="4" controlId="formHouseNumber">
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

                <Form.Group as={Col} md="4" controlId="formLocalNumber">
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
    )
}