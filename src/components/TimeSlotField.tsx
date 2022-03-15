import React from 'react'
import {Button, Form, Row } from 'react-bootstrap'
import {Control, FieldError, useFieldArray, UseFormRegister } from 'react-hook-form';
import type DoctorScheduleForm from "../pages/EnterSchedulePage"

interface timeSlotProps {
    register: UseFormRegister<DoctorScheduleForm>;
    errors: {
        week?: FieldError | undefined,
        monSlots?: FieldError[] | undefined,
        tueSlots?: FieldError[] | undefined,
        wedSlots?: FieldError[] | undefined,
        thuSlots?: FieldError[] | undefined,
        friSlots?: FieldError[] | undefined,
        satSlots?: FieldError[] | undefined,
        sunSlots?: FieldError[] | undefined,
    }
    myName: string;
    index: integer;
    label: string;
    control:  Control<DoctorScheduleForm, any>;
}
const TimeSlotTile: React.FC<timeSlotProps> = (props) => {
    const { fields, append, remove } = useFieldArray({
        name: props.myName,
        props.control
    });
    return <>
        <FieldSet label={`${props.myName}Time slots`}>
            {fields.map((field, index) => {
                return (
                    <Row key={field.id}>
                        <Form.Select aria-label="beginning-hour">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                        </Form.Select>
                        :
                        <Form.Select aria-label="beginning-minute" >
                            <option value="0">00</option>
                            <option value="15">15</option>
                            <option value="30">30</option>
                            <option value="45">45</option>
                        </Form.Select>
                        -
                        <Form.Select aria-label="end-hour">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                        </Form.Select>
                        :
                        <Form.Select>
                            <option value="0">00</option>
                            <option value="15">15</option>
                            <option value="30">30</option>
                            <option value="45">45</option>
                        </Form.Select>
                        <Button type="button" onClick={() => remove(index)}>
                            &#8722;
                        </Button>
                    </Row>
                );
            })}
            <Button
                type="button"
                onClick={() => append({ name: "", amount: "" })}
            >
                Add ingredient
            </Button>
        </FieldSet>
    </>
}
export default TimeSlotTile;