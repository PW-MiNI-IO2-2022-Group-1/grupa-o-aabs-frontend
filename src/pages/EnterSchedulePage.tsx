import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button, Form, Container, Row } from "react-bootstrap";
import TimeSlotField from "../components/TimeSlotField";

export type DoctorScheduleForm = {
    week: Date,
    monSlots: Date[],
    tueSlots: Date[],
    wedSlots: Date[],
    thuSlots: Date[],
    friSlots: Date[],
    satSlots: Date[],
    sunSlots: Date[]
};
const fieldWidth = 8;

function EnterSchedulePage(){
    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm<DoctorScheduleForm>();

    const submitForm = (formData: DoctorScheduleForm) => {
        console.log(formData);
    };

    return (
        <Container>
            <h1>Select your timeslots:</h1>
            <Form onSubmit={handleSubmit(submitForm)}>
                <Row>
                    <Form.Group>
                        <TimeSlotField register={register} control={control} errors={errors} myName="monSlots" index="0" label="Monday:"/>
                    </Form.Group>
                    <Form.Group>
                        <TimeSlotField register={register} control={control} errors={errors} myName="tueSlots" index="1" label="Tuesday:"/>
                    </Form.Group>
                    <Form.Group>
                        <TimeSlotField register={register} control={control} errors={errors} myName="wenSlots" index="2" label="Wednesday:"/>
                    </Form.Group>
                    <Form.Group>
                        <TimeSlotField register={register} control={control} errors={errors} myName="thuSlots" index="3" label="Thursday:"/>
                    </Form.Group>
                    <Form.Group>
                        <TimeSlotField register={register} control={control} errors={errors} myName="friSlots" index="4" label="Friday:"/>
                    </Form.Group>
                    <Form.Group>
                        <TimeSlotField register={register} control={control} errors={errors} myName="satSlots" index="5" label="Saturday:"/>
                    </Form.Group>
                    <Form.Group>
                        <TimeSlotField register={register} control={control} errors={errors} myName="sunSlots" index="6" label="Sunday:"/>
                    </Form.Group>
                </Row>
                <Form.Group>
                    <Button type="submit">Save</Button>
                </Form.Group>
            </Form>
        </Container>
    );
};
export default EnterSchedulePage;