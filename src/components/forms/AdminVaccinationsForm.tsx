import { useForm } from "react-hook-form"
import {Col, Container, Row, Form} from "react-bootstrap";
import React from "react";

export type VaccinationFilterData = {
    disease: string | undefined;
    patientId: number | undefined;
    doctorId: number | undefined;
}

export default function AdminVaccinationForm({onSubmit}: {onSubmit: (data: VaccinationFilterData) => void}) {
    const { register, handleSubmit, setError, formState: {errors}, reset }
        = useForm<VaccinationFilterData>({
        defaultValues:
            {
                patientId: undefined,
                disease: undefined,
                doctorId: undefined,
            }
    });

    return <form onSubmit={handleSubmit(onSubmit)}>
            <Container style={{paddingInline: "0px"}}>
                <Row className="d-flex-nowrap d-flex justify-content-between">
                    <Col>
                        <Form.Group controlId="formPatientId">
                            <Form.Control
                                type="text"
                                placeholder="Patient Id"
                                {...register("patientId", {
                                    validate: (v) => {
                                        const isV = (v === undefined || !isNaN(v))
                                        if(!isV) setError('patientId', {type: 'number', message: 'Should be a number'})
                                        return isV;
                                    },
                                    setValueAs: (v) => {
                                        if(v === "") return undefined;
                                        return parseInt(v);
                                    }
                                })}
                                isInvalid={!!errors.patientId}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.patientId?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formDoctorId">
                            <Form.Control
                                type="text"
                                placeholder="Doctor Id"
                                {...register("doctorId", {
                                    validate: (v) => {
                                        const isV = v === undefined || !isNaN(v)
                                        if(!isV) setError('doctorId', {type: 'number', message: 'Should be a number'})
                                        return isV;
                                    },
                                    setValueAs: (v) => {
                                        if(v === "") return undefined;
                                        return parseInt(v);
                                    }
                                })}
                                isInvalid={!!errors.doctorId}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.doctorId?.message}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formDisease">
                            <Form.Control
                                type="text"
                                placeholder="Disease"
                                {...register("disease", {
                                    setValueAs: (v) => {
                                        if(v === "") return undefined;
                                        return v;
                                    }
                                })}
                                isInvalid={!!errors.disease}
                            />
                        </Form.Group>
                    </Col>
                <Col>
                    <Form.Group>
                        <button type='submit' className='btn btn-primary' data-testid='login' id='submitBtn'>
                            Filter
                        </button>
                    </Form.Group>
                </Col>
                </Row>
            </Container>

    </form>
}