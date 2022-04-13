import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Timeslot, Vaccine } from "../types/vaccination";
import "./VaccinationDateChoiceForm.css";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Container, Row, Col } from "react-bootstrap";
import { getAvailableTimeslots } from "../logic/patientApi";
import { useAuth } from "./AuthComponents";
import { useSimpleModal } from "./useSimpleModal";
import { UnauthorizedRequestError } from "../types/unauthorizedRequestError";

interface VaccinationDateChoiceFormProps {
    vaccine: Vaccine;
    onTimeslotChoiceCallback: (timeslot: Timeslot) => void;
}

function VaccinationDateChoiceForm(props: VaccinationDateChoiceFormProps) {
    const auth = useAuth();
    const chosenVaccine: Vaccine = props.vaccine;
    const [date, setDate] = useState<Date>(new Date());
    const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
    const [showModal, renderModal] = useSimpleModal();

    useEffect(() => {
        getAvailableTimeslots(auth).then(setTimeslots).catch(error => {
            if(error instanceof UnauthorizedRequestError)
                showModal('Error', 'You are not authorized', () => auth.signOut());
            else
                showModal('Error', 'Unexpected error');
        });
    }, []);

    const formatTime = (time: Date): string => {
        let hours = time.getHours();
        let minutes = time.getMinutes();
        return (hours < 10 ? '0' + hours.toString() : hours.toString())
            + ':' + (minutes < 10 ? '0' + minutes.toString() : minutes.toString());
    }

    const filterTimeslots = (date: Date): Timeslot[] => {
        const dateString = date.toDateString();
        return timeslots.filter((timeslot) => timeslot.date.toDateString() == dateString);
    }

    const renderTimeSlot = (slot: Timeslot, index: number) => {
        return (<button className='btn btn-light btn-outline-dark btn-rounded animated-btn my-3'
                        key={'timeslot-' + index.toString()}
                        onClick={() => props.onTimeslotChoiceCallback(slot)}
                        style={{width: '200px'}}>
                    {<h1 className='d-inline'>{formatTime(slot.date)}</h1>}
                </button>);
    }

    const renderTimeSlots = (): JSX.Element[] => {
        const filteredTimeslots = filterTimeslots(date).sort((a, b) => a.date.getTime() - b.date.getTime());
        return [...Array(Math.ceil(filteredTimeslots.length/2))].map((_, index) => {
            const firstIndex = 2 * index;
            const secondIndex = firstIndex + 1;
            return (<Row>
                <Col>
                    {renderTimeSlot(filteredTimeslots[firstIndex], firstIndex)}
                </Col>
                {secondIndex < filteredTimeslots.length ?
                    <Col>
                        {renderTimeSlot(filteredTimeslots[secondIndex], secondIndex)}
                    </Col> 
                    : <></>
                }
            </Row>);
        });
    }

    return (<>
        {renderModal()}
        <Row>
            <Col style={{width: '400px'}}>
                <h1 style={{overflowX: 'hidden'}}>{chosenVaccine.name} ({chosenVaccine.disease})</h1>
                <div className='gap'/>
                <Calendar className='react-calendar' value={date} onChange={setDate}/>
            </Col>
            <Col>
                <div className='scrollable-box'>
                    {renderTimeSlots()}
                </div>
            </Col>
        </Row>
    </>);
}

export default VaccinationDateChoiceForm;