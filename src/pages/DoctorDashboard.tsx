import {useState, useEffect, useCallback} from 'react';
import { Button, ButtonGroup, Col, Container, Row, Spinner, ToggleButton } from 'react-bootstrap';
import PatientVisitField from '../components/PatientVisit';
import './DoctorDashboard.css';
import { useNavigate } from 'react-router-dom';
import { AuthContextType } from '../types/auth';
import {Vaccination, Visit} from '../types/vaccination';
import {addDays, addMinutes} from '../utils/dateUtils';
import DatePicker from 'react-date-picker';
import { deleteVisit, getSlots } from '../logic/doctorAPI';
import { useAuth } from '../components/AuthComponents';

function DoctorDashboard() {
    const navigate = useNavigate()
    let today = new Date();
    today.setHours(0,0,0,0);
    const [startDate, onStartDateChange] = useState<Date>(today);
    const [endDate, onEndDateChange] = useState<Date>(addMinutes(addDays(today, 6), 1439));
    const [reserved, setReserved] = useState<string>('-1');
    const [page, setPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(10);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [Visits, setVisits] = useState<Visit[]>([]);
    const radios = [
        { name: 'All', value: '-1' },
        { name: 'Free', value: '0' },
        { name: 'Reserved', value: '1' },
    ];
    const min = function (a: number, b: number) {
        if(a < b) return a;
        return b;
    }
    let auth: AuthContextType = useAuth();

    const getVisits = useCallback(async () =>{
        setError('')

        setLoading(true);
        await getSlots(startDate, endDate, reserved, auth.token, page).then((response) => {
                setPage(min(response.pagination.totalPages, page))
                setMaxPage(response.pagination.totalPages);
                console.log(response.data);
                const visits = response.data.map((v: {date: string, id: number, vaccination: Vaccination | null}) =>{
                    return {
                        date: new Date(v.date),
                        id: v.id,
                        vaccination: v.vaccination
                    }})
                console.log(visits);
                setVisits(visits);
                console.log(Visits);
                return;
        }).catch(reason => {
            switch (reason.status)
            {
                case 401:
                    auth.signOut()
                    navigate('/loginDoctor');
                    break;
                case 422:
                    setError('Validation error');
                    break;
                default:
                    setError('Unknown error');
                    console.log(reason.message);
            }
            setVisits([]);
        }).finally(() => setLoading(false))

    }, [startDate, endDate, reserved, page])
    useEffect(() => {
        getVisits();
    },[startDate, endDate, reserved, page])

    function remove(index: number) {
        deleteVisit(Visits[index], auth.token).then((_) => {
            getVisits();
        }).catch((reason => {
            console.log(reason);
        }));
    }

    return (
        <div>
            <Container style={{width: '500px', margin: 5}}>
                <Row>Doctor Dashboard</Row>
                    <Row style={{padding: '2px'}}>
                        <Col>From:</Col>
                        <Col><DatePicker
                            disabled={loading}
                        onChange={ (date: Date) => {
                            setPage(1);
                            onStartDateChange(date)
                        }}
                            minDate={today}
                        value={startDate}
                        format='dd.MM.y'
                        /></Col>
                    </Row>
                    <Row style={{padding: '2px'}}>
                        <Col>To:</Col>
                        <Col><DatePicker
                            disabled={loading}
                            onChange={(date: Date) => {
                                setPage(1);
                                onEndDateChange(date)
                            }}
                            minDate={today}
                            value={endDate}
                            format='dd.MM.y'
                        /></Col>
                    </Row>
                <Row style={{padding: '2px'}} xs={'auto'}>
                    <ButtonGroup>
                        {radios.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`radio-${idx}`}
                                type='radio'
                                variant='outline-secondary'
                                name='radio'
                                value={radio.value}
                                disabled={loading}
                                checked={reserved === radio.value}
                                onChange={(e) => {
                                    setPage(1);
                                    setReserved(e.currentTarget.value)}
                            }
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </Row>
                <Row style={{padding: '2px'}}>
                    <Button style={{width: '150px'}} onClick={() => navigate('/doctor/setSchedule')}>Set schedule</Button>
                </Row>
            </Container>

            <Container>
                <Col className={`d-flex${Visits.length === 0  && !loading ? '' : '-nowrap'} justify-content-center`}>{loading ?  <Spinner animation='border'/> : (Visits.length===0 ?  <div>{error}</div> : Visits.map((field, index) => {
                    return <PatientVisitField key={`visit_${index}`} visit={field} index={index} remove={remove}/>
                }))}</Col>
            </Container>
            <Container>
                <Row>
                    <Col className='d-flex justify-content-center'><Button disabled={loading || page<=1} onClick={() => setPage(page - 1)}> Previous Page</Button></Col>
                    <Col className='d-flex justify-content-center'>{loading? '...' : `${page} of ${maxPage}`}</Col>
                    <Col className='d-flex justify-content-center'><Button disabled={loading || page>=maxPage} onClick={() => setPage(page + 1)}> Next Page</Button></Col>
                </Row>

            </Container>
        </div>

    )
}

export default DoctorDashboard;


const sampleInfo: Visit[] = [
    {
        date: new Date('2022-03-29T08:00:00Z'),
        id: 0,
        vaccination: null,
    },
    {
        date: new Date('2022-03-30T08:00:00Z'),
        id: 1,
        vaccination: {
            id: 0,
            status: 'Planned',
            patient: {
                id: 0,
                firstName: 'Adam',
                lastName: 'Abacki',
                pesel: '12345678901',
                email: 'email@example.com',
                address: {
                    id: 0,
                    city: 'Warszawa',
                    zipCode: '01-234',
                    street: 'Przykładowa',
                    houseNumber: '1',
                    localNumber: null,
                }
            },
            vaccine: {
                id: 0,
                name: 'Phiser',
                disease: 'Covid-19',
                requiredDoses: 0,
            },
        }
    },
    {
        date: new Date('2022-03-29T10:00:00Z'),
        id: 0,
        vaccination: null,
    },
];