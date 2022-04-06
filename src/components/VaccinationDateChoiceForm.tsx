import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { Vaccine } from "../types/vaccination";
import "./VaccinationDateChoiceForm.css";

interface VaccinationDateChoiceFormProps {
    vaccine: Vaccine;
//  loadTimeSlots: (date: Date) => Date[];
    onDateChoiceCallback: (date: Date) => void;
}

function VaccinationDateChoiceForm(props: VaccinationDateChoiceFormProps) {
    const chosenVaccine: Vaccine = props.vaccine;
    const [date, setDate] = useState<Date>(new Date());
    const [timeSlots, setTimeSlots] = useState<Date[]>([]);

    const changeDate = (date: Date): void => {
        setDate(date);
        const n = Math.floor(Math.random() * 15 + 1) + 5;
        let timeSlots: Date[] = [];
        for(let i = 0; i < n; i++) {
            const hour = Math.floor(Math.random() * 24 + 1);
            const minute = Math.floor(Math.random() * 60 + 1);
            let newDate: Date = new Date(date);
            newDate.setHours(hour);
            date.setMinutes(minute);
            timeSlots.push(newDate);
        }
        timeSlots.sort();
        setTimeSlots(timeSlots);
    }

    const formatTime = (time: Date): string => {
        let hours = time.getHours();
        let minutes = time.getMinutes();
        return (hours < 10 ? '0' + hours.toString() : hours.toString())
            + ':' + (minutes < 10 ? '0' + minutes.toString() : minutes.toString());
    }

    const zipSlots = (items: Date[]): Date[][] => {
        let zipped: Date[][] = [];
        let accum: Date[] = [];

        for(let i = 0; i < items.length; i++) {
            if(accum.length == 3) {
                zipped.push(accum);
                accum = [];
            }
            accum.push(items[i]);
        }
        if(accum.length > 0)
            zipped.push(accum);

        return zipped;
    }

    const renderTimeSlot = (slot: Date) => {
        return (<button style={{padding: 0, border: 'none', background: 'none'}}
                        onClick={() => props.onDateChoiceCallback(slot)}>
                    <div className='timeslot-container'>
                        <h1 className='text-light d-inline'>{formatTime(slot)}</h1>
                    </div>
                </button>);
    }

    const zipped: Date[][] = zipSlots(timeSlots);

    return (<>
        <h1>{chosenVaccine.name} ({chosenVaccine.disease})</h1>
        <div className='gap'/>
        <Calendar className='react-calendar' value={date} onChange={changeDate}></Calendar>
        {zipped.map((slots) => {
            console.log(slots.length);
            return (<div style={{minWidth: '400px'}}>
                {renderTimeSlot(slots[0])}
                {slots.length >= 2 && renderTimeSlot(slots[1])}
                {slots.length >= 3 && renderTimeSlot(slots[2])}
            </div>)
        })}
    </>);
}

export default VaccinationDateChoiceForm;