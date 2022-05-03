import {Container, Spinner} from 'react-bootstrap';
import type {DoctorScheduleForm, TimeSlot} from '../components/forms/ScheduleForm';
import {addDays, addMinutes} from '../utils/dateUtils';
import ScheduleForm from '../components/forms/ScheduleForm';
import {setScheduleDate} from "../logic/doctorAPI";
import {useAuth} from "../components/AuthComponents";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {logOut} from "../logic/login";
import { UnauthorizedRequestError } from '../types/requestErrors';

function SetSchedulePage() {
    const auth = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const submitForm = async (formData: DoctorScheduleForm) => {
        const day = new Date(formData.week.getTime());
        const slots = [
            ...convertSlots(new Date(day.getTime()), formData.monSlots),
            ...convertSlots(addDays(day, 1), formData.tueSlots),
            ...convertSlots(addDays(day, 2), formData.wedSlots),
            ...convertSlots(addDays(day, 3), formData.thuSlots),
            ...convertSlots(addDays(day, 4), formData.friSlots),
            ...convertSlots(addDays(day, 5), formData.satSlots),
            ...convertSlots(addDays(day, 6), formData.sunSlots),
        ];
        let errorTimes = 0;
        setError('');
        setLoading(true);
        const actions = slots.map(async (s) => setScheduleDate(s, auth).catch(reason => {
            if(reason instanceof UnauthorizedRequestError) {
                logOut(auth);
                navigate('/loginDoctor');
            }
            errorTimes++;
        }));
        await Promise.all(actions);
        setLoading(false);
        if (errorTimes > 0)
            setError(`${errorTimes} errors while sending data`)
        else {
            setError('');
            navigate('/doctor');
        }

    };

    const convertSlots = (day: Date, slots: TimeSlot[]) => {
        var slotDates: Date[] = [];
        if (slots.length === 0) return slotDates;
        slots.forEach(
            function convertToDates(element: TimeSlot) {
                day.setHours(parseInt(element.beginning.hour), parseInt(element.beginning.minute));
                var diff = (parseInt(element.end.hour) * 60 + parseInt(element.end.minute) - parseInt(element.beginning.hour) * 60 - parseInt(element.beginning.minute));
                var times = Math.floor(diff / 15) + 1;
                for (let i = 0; i < times; i++) {
                    slotDates.push(addMinutes(day, i * 15));
                }
            }
        )
        return slotDates;
    }

    return (
        <Container style={{margin: '3px'}}>
            <h1>{loading ? 'sending data to server...' : 'Select your timeslots:'}</h1>
            {error !== '' ? <div data-testid='errors'> {error.split('\n').map((line) => {
                return (
                    <>
                        {line}
                        <br/>
                    </>
                )
            })} </div> : <></>}
            {loading ? <Spinner animation="border"/> : <ScheduleForm onSubmit={submitForm}/>}
        </Container>
    );

};

export default SetSchedulePage;