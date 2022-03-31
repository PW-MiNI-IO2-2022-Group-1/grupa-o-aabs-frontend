import {DoctorScheduleForm, TimeSlot} from "./types";
import {Button, Col, Form} from "react-bootstrap";
import moment from "moment";
import {Controller, useForm} from "react-hook-form";
import Calendar from "react-calendar";
import {addDays, addMinutes, getBeginningOfWeek} from "./dateUtils";
import TimeSlotField from "./TimeSlotField";
import React from "react";
import './Calendar.css';
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

function ScheduleForm({onSubmit} : {onSubmit: (data: DoctorScheduleForm) => void})
{
    today.setDate(today.getDate() - ((today.getDay() - 1) % 7));
    today.setHours(0,0,0,0);
    const {
        register,
        handleSubmit,
        getValues,
        watch,
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
    return <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
            <Form.Label>{`Select week: ${moment(watch('week')).format("DD.MM.YYYY")}-${moment(watch('week')).add(6, 'days').format("DD.MM.YYYY")}`} </Form.Label>
            <Controller
                control={control}
                name='week'
                render={({ field }) => (
                    <Calendar
                        onChange={(date: any) => {
                            field.onChange(getBeginningOfWeek(date))}
                        }
                        value={[field.value, addDays(field.value, 6)]}
                    />
                )}
            />
        </Form.Group>
        <Col className="slotsCol">
            <TimeSlotField register={register} control={control} errors={errors} index={0} values={getValues}/>
            <TimeSlotField register={register} control={control} errors={errors} index={1} values={getValues}/>
            <TimeSlotField register={register} control={control} errors={errors} index={2} values={getValues}/>
            <TimeSlotField register={register} control={control} errors={errors} index={3} values={getValues}/>
            <TimeSlotField register={register} control={control} errors={errors} index={4} values={getValues}/>
            <TimeSlotField register={register} control={control} errors={errors} index={5} values={getValues}/>
            <TimeSlotField register={register} control={control} errors={errors} index={6} values={getValues}/>
        </Col>
        <Form.Group>
            <Button type="submit">Save</Button>
        </Form.Group>
    </Form>
}

export default ScheduleForm;