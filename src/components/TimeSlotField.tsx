import React from 'react'
import {Button, Col, Container, Form, Row } from 'react-bootstrap'
import {Control, useFieldArray, UseFormGetValues, UseFormRegister } from 'react-hook-form';
import type { DoctorScheduleForm } from "./types"
import "./TimeSlotField.css"
import { string } from 'yup/lib/locale';

interface timeSlotProps {
    register: UseFormRegister<DoctorScheduleForm>;
    errors: any;
    index: number;
    control:  Control<DoctorScheduleForm, any>;
    values:  UseFormGetValues<DoctorScheduleForm>;
}

const TimeSlotTile: React.FC<timeSlotProps> = (props) => {
    var myLabel;
    var myName:  "monSlots" | "tueSlots" | "wedSlots" | "thuSlots" | "friSlots" | "satSlots" | "sunSlots";
    switch(props.index){
        case 0:
            myName = "monSlots";
            myLabel = "Monday:";
            break;
        case 1:
            myName = "tueSlots";
            myLabel = "Tuesday:";
            break;
        case 2:
            myName = "wedSlots";
            myLabel = "Wednesday:";
            break;
        case 3:
            myName = "thuSlots";
            myLabel = "Thursday:";
            break;
        case 4:
            myName = "friSlots";
            myLabel = "Friday:";
            break;
        case 5:
            myName = "satSlots";
            myLabel = "Saturday:";
            break;
        case 6:
            myName = "sunSlots";
            myLabel = "Sunday:";
            break;
        default:
            myName = "monSlots";
            myLabel = "Monday:";
    }
    const { fields, append, remove } = useFieldArray({
        name: myName,
        control: props.control
    });
    return <Container style={{width: "500px", margin: "0px" }}>
        <Form.Group>
            <Form.Label>{myLabel}</Form.Label>
            {fields.map((field, index) => {
                return (
                    <Row key={field.id} className="form-row">
                        <Col>
                            <Form.Select
                                aria-label="beginning-hour"
                                {...props.register(`${myName}.${index}.beginning.hour` as const)}>
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
                        </Col>
                        :
                        <Col>
                            <Form.Select
                                aria-label="beginning-minute"
                                {...props.register(`${myName}.${index}.beginning.minute`)}
                            >
                                <option value="00">00</option>
                                <option value="15">15</option>
                                <option value="30">30</option>
                                <option value="45">45</option>
                            </Form.Select>
                        </Col>
                        -
                        <Col>
                            <Form.Select
                                aria-label="end-hour"
                                {...props.register(`${myName}.${index}.end.hour`)}
                            >
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
                        </Col>
                        :
                        <Col>
                            <Form.Select
                                aria-label="end-minutes"
                                {...props.register(`${myName}.${index}.end.minute`)}
                            >
                                <option value="00">00</option>
                                <option value="15">15</option>
                                <option value="30">30</option>
                                <option value="45">45</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Button type="button" className="c_btn" onClick={() => remove(index)}>
                                &#8722;
                            </Button>
                        </Col>

                    </Row>
                );
            })}
            <Button
                type="button"
                onClick={() =>{
                    var b = {
                        hour: "8",
                        minute: "00",
                    };
                    var e = {
                        hour: "16",
                        minute: "00",
                    };
                    append({ beginning: b, end: e})
                }}
            >
                Add time slot
            </Button>
        </Form.Group>
    </Container>
}
export default TimeSlotTile;