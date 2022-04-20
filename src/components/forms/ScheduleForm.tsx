import { Button, Col, Form } from 'react-bootstrap';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import Calendar from 'react-calendar';
import { addDays, getBeginningOfWeek } from '../../utils/dateUtils';
import TimeSlotField from '../TimeSlotField';
import '../Calendar.css';

export type DoctorScheduleForm = {
    week: Date,
    monSlots: TimeSlot[],
    tueSlots: TimeSlot[],
    wedSlots: TimeSlot[],
    thuSlots: TimeSlot[],
    friSlots: TimeSlot[],
    satSlots: TimeSlot[],
    sunSlots: TimeSlot[]
};

export type TimeSlot = {
    beginning: {
        hour: string;
        minute: string;
    },
    end: {
        hour: string;
        minute: string;
    },
}


const today = new Date();
const initSlots = [
    {
        beginning: {
            hour: '8',
            minute: '00'
        },
        end: {
            hour: '12',
            minute: '00'
        }
    },
    {
        beginning: {
            hour: '12',
            minute: '30'
        },
        end: {
            hour: '17',
            minute: '00'
        }
    },

]
function validateBeginningTime(ts: TimeSlot, prevTS: TimeSlot) {
    return parseInt(ts.beginning.hour) * 60
        + parseInt(ts.beginning.minute) >
        parseInt(prevTS.end.hour) * 60
        + parseInt(prevTS.end.minute);
}
function validateEndTime(ts: TimeSlot) {
    return parseInt(ts.beginning.hour) * 60
        + parseInt(ts.beginning.minute) >
        parseInt(ts.end.hour) * 60
        + parseInt(ts.end.minute);
}
function ScheduleForm({onSubmit} : {onSubmit: (data: DoctorScheduleForm) => void})
{
    /*const validationSchema = Yup.object().shape({
        monSlots: Yup.array().of(
            Yup.object().shape({
                beginning: Yup.object().shape({
                        hour: Yup.string(),
                        minute: Yup.string()
                    }),
                end: Yup.object().shape({
                        hour: Yup.string(),
                        minute: Yup.string()
                    }),
            }),
        ).defined().test({
            name: 'first-and-last',
            message: 'blah',
            test: val=>
                val.every(
                    ({ startTime, endTime }, index) => {
                        if (index === 0 || index === val.length - 1) {
                            return !!startTime && !!endTime;
                        }
                        return true;
                    }
                )
        })
    });*/
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
            <Form.Label>{`Select week: ${moment(watch('week')).format('DD.MM.YYYY')}-${moment(watch('week')).add(6, 'days').format('DD.MM.YYYY')}`} </Form.Label>
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
        <Col className='slotsCol'>
            <TimeSlotField register={register} control={control} errors={errors} index={0} values={getValues}/>
            <TimeSlotField register={register} control={control} errors={errors} index={1} values={getValues}/>
            <TimeSlotField register={register} control={control} errors={errors} index={2} values={getValues}/>
            <TimeSlotField register={register} control={control} errors={errors} index={3} values={getValues}/>
            <TimeSlotField register={register} control={control} errors={errors} index={4} values={getValues}/>
            <TimeSlotField register={register} control={control} errors={errors} index={5} values={getValues}/>
            <TimeSlotField register={register} control={control} errors={errors} index={6} values={getValues}/>
        </Col>
        <Form.Group>
            <Button type='submit'>Save</Button>
        </Form.Group>
    </Form>
}

export default ScheduleForm;