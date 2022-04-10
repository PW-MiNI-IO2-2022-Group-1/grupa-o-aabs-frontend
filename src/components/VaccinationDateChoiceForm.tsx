import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Vaccine } from "../types/vaccination";
import "./VaccinationDateChoiceForm.css";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Container, Row, Col } from "react-bootstrap";

interface VaccinationDateChoiceFormProps {
    vaccine: Vaccine;
//  loadTimeSlots: (date: Date) => Date[];
    onDateChoiceCallback: (date: Date) => void;
}

function VaccinationDateChoiceForm(props: VaccinationDateChoiceFormProps) {
    const getRandomTimeSlots = (date: Date): Date[] => {
        const n = Math.floor(Math.random() * 4 + 1) + 5;
        const timeSlots: Date[] = [];
        for(let i = 0; i < n; i++) {
            const hour = Math.floor(Math.random() * 24 + 1);
            const minute = Math.floor(Math.random() * 60 + 1);
            let newDate: Date = new Date(date);
            newDate.setHours(hour);
            date.setMinutes(minute);
            timeSlots.push(newDate);
        }
        timeSlots.sort();
        return timeSlots;
    }

    const chosenVaccine: Vaccine = props.vaccine;
    const [date, setDate] = useState<Date>(new Date());
    const [timeSlots, setTimeSlots] = useState<Date[]>(getRandomTimeSlots(date));

    const changeDate = (date: Date): void => {
        setDate(date);
        setTimeSlots(getRandomTimeSlots(date));
    }

    const formatTime = (time: Date): string => {
        let hours = time.getHours();
        let minutes = time.getMinutes();
        return (hours < 10 ? '0' + hours.toString() : hours.toString())
            + ':' + (minutes < 10 ? '0' + minutes.toString() : minutes.toString());
    }

    const renderTimeSlot = (slot: Date, index: number) => {
        return (<button className='btn btn-light btn-outline-dark btn-rounded animated-btn my-3'
                        key={'timeslot-' + index.toString()}
                        onClick={() => props.onDateChoiceCallback(slot)}
                        style={{width: '200px'}}>
                    {<h1 className='d-inline'>{formatTime(slot)}</h1>}
                </button>);
    }

    return (<Row>
        <Col style={{width: '400px'}}>
            <h1 style={{overflowX: 'hidden'}}>{chosenVaccine.name} ({chosenVaccine.disease})</h1>
            <div className='gap'/>
            <Calendar className='react-calendar' value={date} onChange={changeDate}></Calendar>
        </Col>
        <Col>
            <div className='scrollable-box'>
                {[...Array(Math.ceil(timeSlots.length/2))].map((_, index) => {
                    const firstIndex = 2 * index;
                    const secondIndex = firstIndex + 1;
                    return (<Row>
                        <Col>
                            {renderTimeSlot(timeSlots[firstIndex], firstIndex)}
                        </Col>
                        {secondIndex < timeSlots.length ?
                            <Col>
                                {renderTimeSlot(timeSlots[secondIndex], secondIndex)}
                            </Col> 
                            : <></>
                        }
                    </Row>);
                })}
            </div>
        </Col>
    </Row>);
}

export default VaccinationDateChoiceForm;