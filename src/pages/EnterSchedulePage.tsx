import React from "react";
import { Container } from "react-bootstrap";
import type { DoctorScheduleForm, TimeSlot } from "../components/types"
import { addMinutes } from "../components/dateUtils";
import ScheduleForm from "../components/ScheduleForm";
function EnterSchedulePage(){

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
        console.log(slots);
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
        <Container style={{margin: "3px"}}>
            <h1>Select your timeslots:</h1>
            <ScheduleForm onSubmit={submitForm}/>
        </Container>
    );
};
export default EnterSchedulePage;