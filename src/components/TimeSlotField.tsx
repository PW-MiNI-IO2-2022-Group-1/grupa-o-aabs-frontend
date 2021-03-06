import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Control, useFieldArray, UseFormGetValues, UseFormRegister } from 'react-hook-form';
import { DoctorScheduleForm } from './forms/ScheduleForm';
import './TimeSlotField.css'

interface timeSlotProps {
    register: UseFormRegister<DoctorScheduleForm>;
    errors: any;
    index: number;
    control:  Control<DoctorScheduleForm, any>;
    values:  UseFormGetValues<DoctorScheduleForm>;
}

const TimeSlotTile: React.FC<timeSlotProps> = (props) => {
    var myLabel;
    var myName:  'monSlots' | 'tueSlots' | 'wedSlots' | 'thuSlots' | 'friSlots' | 'satSlots' | 'sunSlots';
    switch(props.index){
        case 0:
            myName = 'monSlots';
            myLabel = 'Monday:';
            break;
        case 1:
            myName = 'tueSlots';
            myLabel = 'Tuesday:';
            break;
        case 2:
            myName = 'wedSlots';
            myLabel = 'Wednesday:';
            break;
        case 3:
            myName = 'thuSlots';
            myLabel = 'Thursday:';
            break;
        case 4:
            myName = 'friSlots';
            myLabel = 'Friday:';
            break;
        case 5:
            myName = 'satSlots';
            myLabel = 'Saturday:';
            break;
        case 6:
            myName = 'sunSlots';
            myLabel = 'Sunday:';
            break;
        default:
            myName = 'monSlots';
            myLabel = 'Monday:';
    }
    const { fields, append, remove } = useFieldArray({
        name: myName,
        control: props.control
    });
    return <Container style={{width: '500px', margin: '0px' }}>
        <Form.Group>
            <Form.Label>{myLabel}</Form.Label>
            <br/>
            {fields.map((field, index) => {
                return (
                    <Row className="form-row" key={`TimeField_${myName}_${field.id}_row`}>
                        <Col>
                            <Form.Select key={`TimeField_${myName}_${field.id}_select`}
                                aria-label="beginning-hour"
                                {...props.register(`${myName}.${index}.beginning.hour` as const)}
                            >
                                {[...Array(24)].map((_, index) => {
                                    return <option key={index} value={index.toString()}>{index}</option>
                                })}
                            </Form.Select>
                        </Col>
                        :
                        <Col>
                            <Form.Select
                                aria-label='beginning-minute'
                                {...props.register(`${myName}.${index}.beginning.minute`as const)}
                            >
                                <option value='00'>00</option>
                                <option value='15'>15</option>
                                <option value='30'>30</option>
                                <option value='45'>45</option>
                            </Form.Select>
                        </Col>
                        -
                        <Col>
                            <Form.Select
                                aria-label='end-hour'
                                {...props.register(`${myName}.${index}.end.hour`)}
                            >
                                {[...Array(24)].map((_, index) => {
                                    return <option key={index} value={index.toString()}>{index}</option>
                                })}
                            </Form.Select>
                        </Col>
                        :
                        <Col>
                            <Form.Select
                                aria-label='end-minutes'
                                {...props.register(`${myName}.${index}.end.minute`)}
                            >
                                <option value='00'>00</option>
                                <option value='15'>15</option>
                                <option value='30'>30</option>
                                <option value='45'>45</option>
                            </Form.Select>
                        </Col>
                        <Col>
                            <Button type='button' className='c_btn' onClick={(e: React.MouseEvent) =>{
                                e.preventDefault();
                                remove(index)
                            }}>
                                &#8722;
                            </Button>
                        </Col>

                    </Row>
                );
            })}
            <Button
                type='button'
                onClick={(e: React.MouseEvent) =>{
                    e.preventDefault();
                    append({
                        beginning: {
                            hour: '8',
                            minute: '00',
                        },
                        end: {
                            hour: '16',
                            minute: '00',
                        }
                    })
                }}
            >
                Add time slot
            </Button>
        </Form.Group>
    </Container>
}
export default TimeSlotTile;