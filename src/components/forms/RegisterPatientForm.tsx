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

    const {register, handleSubmit, formState: {errors}} = useForm<RegistrationData>();

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
                    type="text"
                    placeholder="example@domain.com"
                    {...register("email", {
                        required: "Email required",
                        pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: 'Wrong PESEL format'
                        }
                    })}
                    isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                </Form.Control.Feedback>

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
                            required: 'Password required'
                        })}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password?.message}
                    </Form.Control.Feedback>
                </Form.Group>
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
                            required: 'First name required'
                        })}
                        isInvalid={!!errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.firstName?.message}
                    </Form.Control.Feedback>
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
                        })}
                        isInvalid={!!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.lastName?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                {/*Tutaj może ewentualnie zmienić, aby były takie placeholdery na cyfry*/}
                <Form.Group as={Col} md="4" controlId="formPESEL">
                    <Form.Label>
                        PESEL
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="PESEL"
                        {...register("pesel", {
                            required: {
                                value: true,
                                message: "PESEL required"
                            },
                            pattern: {
                                value: /^[0-9]{11}$/,
                                message: 'Wrong PESEL format'
                            }
                        })}
                        isInvalid={!!errors.pesel}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.pesel?.message}
                    </Form.Control.Feedback>
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
                            required: 'City required'
                        })}
                        isInvalid={!!(errors.address?.city)}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.address?.city?.message}
                    </Form.Control.Feedback>
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
                            required: 'Zip code required',
                            pattern: {
                                value: /^[0-9]{2}-[0-9]{3}$/,
                                message: 'Wrong zip code format'
                            }
                        })}
                        isInvalid={!!errors.address?.zipCode}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.address?.zipCode?.message}
                    </Form.Control.Feedback>
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
                            required: 'Street required'
                        })}
                        isInvalid={!!errors.address?.street}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.address?.street?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="formHouseNumber">
                    <Form.Label>
                        House number
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="House number"
                        {...register("address.houseNumber", {
                            required: 'House number required'
                        })}
                        isInvalid={!!errors.address?.houseNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.address?.houseNumber?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="4" controlId="formLocalNumber">
                    <Form.Label>
                        Local number
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Local Number"
                        {...register("address.localNumber")}
                        isInvalid={!!errors.address?.localNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.address?.localNumber?.message}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Button
                id = 'submitBtn'
                className="mt-4"
                variant="primary" type="submit">
                Register
            </Button>
        </Form>
    )
}