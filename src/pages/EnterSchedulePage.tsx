import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button, Form, Container, Row } from "react-bootstrap";
import DatePicker from 'react-date-picker';
import TimeSlotField from "../components/TimeSlotField";
import type { DoctorScheduleForm, TimeSlot} from "../components/types"
const fieldWidth = 8;
const today = new Date();
const initSlots = [
    {
        beginning: new Date(today.setHours(8,0,0,0)),
        end: new Date(today.setHours(12,0,0,0))
    },
    {
        beginning: new Date(today.setHours(12,30,0,0)),
        end: new Date(today.setHours(18,0,0,0))
    },

]
function EnterSchedulePage(){
    today.setDate(today.getDate() - ((today.getDay() - 1) % 7));
    today.setHours(0,0,0,0);
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
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
                friSlots: initSlots
            }
        }
    );
    function addMinutes(date: Date, minutes: number) {
        return new Date(date.getTime() + minutes*60000);
    }
    const convertSlots = (slots: TimeSlot[]) => {
        var slotDates: Date[] = [];
        slots.forEach(
            function convertToDates(element: TimeSlot){
                var diff = (element.end.getTime() - element.beginning.getTime());
                var times = Math.round(diff / 900000);
                for (let i = 0; i < times; i++) {
                    slotDates.push(addMinutes(element.beginning,i * 15));
                }
            }
        )
        return slotDates;
    }
    const submitForm = (formData: DoctorScheduleForm) => {
        formData.monSlots.forEach((e) => {e.beginning.setDate(formData.week.getDate()); e.end.setDate(formData.week.getDate())});
        formData.tueSlots.forEach((e) => {e.beginning.setDate(formData.week.getDate() + 1); e.end.setDate(formData.week.getDate() + 1)});
        formData.wedSlots.forEach((e) => {e.beginning.setDate(formData.week.getDate() + 2); e.end.setDate(formData.week.getDate() + 2)});
        formData.thuSlots.forEach((e) => {e.beginning.setDate(formData.week.getDate() + 3); e.end.setDate(formData.week.getDate() + 3)});
        formData.friSlots.forEach((e) => {e.beginning.setDate(formData.week.getDate() + 4); e.end.setDate(formData.week.getDate() + 4)});
        formData.satSlots.forEach((e) => {e.beginning.setDate(formData.week.getDate() + 5); e.end.setDate(formData.week.getDate() + 5)});
        formData.sunSlots.forEach((e) => {e.beginning.setDate(formData.week.getDate() + 6); e.end.setDate(formData.week.getDate() + 6)});
        var slots =[
            ...formData.monSlots,
            ...formData.tueSlots,
            ...formData.wedSlots,
            ...formData.thuSlots,
            ...formData.friSlots,
            ...formData.satSlots,
            ...formData.sunSlots,
        ]

        console.log(convertSlots(slots));
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