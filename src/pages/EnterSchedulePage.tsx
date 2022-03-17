import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Form, Container, Row } from "react-bootstrap";
import DatePicker from 'react-date-picker';
import TimeSlotField from "../components/TimeSlotField";
import type { DoctorScheduleForm, TimeSlot} from "../components/types"
const today = new Date();
const initSlots = [
    {
        beginning: {
            hour: "8",
            minute: "00"
        },
        end: {
            hour: "12",
            minute: "00"
        }
    },
    {
        beginning: {
            hour: "12",
            minute: "30"
        },
        end: {
            hour: "17",
            minute: "00"
        }
    },

]
function EnterSchedulePage(){
    today.setDate(today.getDate() - ((today.getDay() - 1) % 7));
    today.setHours(0,0,0,0);
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        control
    } = useForm<DoctorScheduleForm>(
        {
            defaultValues: {
                week: today,
                monSlots: initSlots,
                tueSlots: initSlots,
                wedSlots: initSlots,
                thuSlots: initSlots,
                friSlots: initSlots,
            }
        }
    );
    function addMinutes(date: Date, minutes: number) {
        return new Date(date.getTime() + minutes*60000);
    }
    const convertSlots = (day: Date, slots: TimeSlot[]) => {
        var slotDates: Date[] = [];
        if(slots.length === 0) return slotDates;
        slots.forEach(
            function convertToDates(element: TimeSlot){
                day.setHours(parseInt(element.beginning.hour), parseInt(element.beginning.minute));
                console.log(day);
                var diff = (parseInt(element.end.hour) * 60 + parseInt(element.end.minute) - parseInt(element.beginning.hour) * 60 - parseInt(element.beginning.minute));
                var times = Math.round(diff / 15);
                for (let i = 0; i < times; i++) {
                    slotDates.push(addMinutes(day,i * 15));
                }
            }
        )
        return slotDates;
    }
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

    return (
        <Container>
            <h1>Select your timeslots:</h1>
            <Form onSubmit={handleSubmit(submitForm)}>
                <Form.Group>
                    <Form.Label>Select week:</Form.Label>
                    <Controller
                        control={control}
                        name='week'
                        render={({ field }) => (
                            <DatePicker
                                onChange={(date: any) => field.onChange(date)}
                                value={field.value}
                            />
                        )}
                    />
                </Form.Group>
                <Row>
                        <TimeSlotField register={register} control={control} errors={errors} index={0} values={getValues}/>
                        <TimeSlotField register={register} control={control} errors={errors} index={1} values={getValues}/>
                        <TimeSlotField register={register} control={control} errors={errors} index={2} values={getValues}/>
                        <TimeSlotField register={register} control={control} errors={errors} index={3} values={getValues}/>
                        <TimeSlotField register={register} control={control} errors={errors} index={4} values={getValues}/>
                        <TimeSlotField register={register} control={control} errors={errors} index={5} values={getValues}/>
                        <TimeSlotField register={register} control={control} errors={errors} index={6} values={getValues}/>
                </Row>
                <Form.Group>
                    <Button type="submit">Save</Button>
                </Form.Group>
            </Form>
        </Container>
    );
};
export default EnterSchedulePage;