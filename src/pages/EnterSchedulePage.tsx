import { Container } from 'react-bootstrap';
import type { DoctorScheduleForm, TimeSlot } from '../components/ScheduleForm';
import { addMinutes } from '../utils/dateUtils';
import ScheduleForm from '../components/ScheduleForm';
import {setScheduleDate} from "../logic/doctorAPI";
import {useAuth} from "../components/AuthComponents";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function EnterSchedulePage(){
    const auth = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const submitForm = (formData: DoctorScheduleForm) => {
        var day = new Date(formData.week.getTime());
        var slots = [
            ...convertSlots(new Date(day.getTime()), formData.monSlots),
            ...convertSlots(new Date(day.getTime() + 86400000), formData.tueSlots),
            ...convertSlots(new Date(day.getTime() + 2 * 86400000), formData.wedSlots),
            ...convertSlots(new Date(day.getTime() + 3 * 86400000), formData.thuSlots),
            ...convertSlots(new Date(day.getTime() + 4 * 86400000), formData.friSlots),
            ...convertSlots(new Date(day.getTime() + 5 * 86400000), formData.satSlots),
            ...convertSlots(new Date(day.getTime() + 6 * 86400000), formData.sunSlots),
        ]
        var error401Times = 0, error422Times = 0, unknownErrorTimes = 0;
        slots.forEach((slot, _) => {
            setScheduleDate(slot, auth.token).then((_) => {
                navigate('/doctor');
            }).catch(reason => {
                    switch (reason)
                    {
                        case 401:
                            error401Times++;
                            break;
                        case 422:
                            error422Times++;
                            break;
                        default:
                            unknownErrorTimes++;
                    }
                });
        })
        const totalErrors = error422Times + error401Times + unknownErrorTimes;
        if(totalErrors > 0)
            setError(`${totalErrors} errors encountered: ${error401Times > 0 ? `${error401Times} slots were unauthorised (invalid or empty Bearer token)` : ''}
             ${error422Times > 0 ? `${error422Times} slots had invalid data` : ''}
            ${unknownErrorTimes > 0 ? `${unknownErrorTimes} slots encountered unknown error` : ''}`)
        else
            setError('');
    };
    const convertSlots = (day: Date, slots: TimeSlot[]) => {
        var slotDates: Date[] = [];
        if(slots.length === 0) return slotDates;
        slots.forEach(
            function convertToDates(element: TimeSlot){
                day.setHours(parseInt(element.beginning.hour), parseInt(element.beginning.minute));
                var diff = (parseInt(element.end.hour) * 60 + parseInt(element.end.minute) - parseInt(element.beginning.hour) * 60 - parseInt(element.beginning.minute));
                var times = Math.round(diff / 15);
                for (let i = 0; i < times; i++) {
                    slotDates.push(addMinutes(day,i * 15));
                }
            }
        )
        return slotDates;
    }
    return (
        <Container style={{margin: '3px'}}>
            <h1>Select your timeslots:</h1>
                {error !== ''? <div data-testid='errors'> {error.split('\n').map((line) => {
                    return (
                        <>
                            {line}
                            <br/>
                        </>
                    )
                })} </div> : <></> }
            <ScheduleForm onSubmit={submitForm}/>
        </Container>
    );
};
export default EnterSchedulePage;