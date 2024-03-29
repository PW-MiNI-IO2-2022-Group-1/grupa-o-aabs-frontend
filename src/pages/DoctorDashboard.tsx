import {useState, useEffect} from 'react';
import {Button, ButtonGroup, Col, Container, Row, Spinner, ToggleButton} from 'react-bootstrap';
import PatientVisitField from '../components/PatientVisit';
import './DoctorDashboard.css';
import {useNavigate} from 'react-router-dom';
import {AuthContextType} from '../types/auth';
import {Vaccination, Visit} from '../types/vaccination';
import {addDays, addMinutes} from '../utils/dateUtils';
import DatePicker from 'react-date-picker';
import {deleteVisit, getSlots, vaccinatePatient} from '../logic/doctorAPI';
import {useAuth} from '../components/AuthComponents';
import {logOut} from '../logic/login';
import {UnauthorizedRequestError} from "../types/requestErrors";
import {useSimpleModal} from "../components/modals/useSimpleModal";

function DoctorDashboard() {
    const auth: AuthContextType = useAuth();
    const navigate = useNavigate()
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    const [startDate, onStartDateChange] = useState<Date>(today);
    const [endDate, onEndDateChange] = useState<Date>(addMinutes(addDays(today, 6), 1439));
    const [reserved, setReserved] = useState<string>('-1');
    const [page, setPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(10);
    const [showErrorModal, renderErrorModal] = useSimpleModal();
    const [loading, setLoading] = useState(false);
    const [Visits, setVisits] = useState<Visit[]>([]);
    const radios = [
        {name: 'All', value: '-1'},
        {name: 'Free', value: '0'},
        {name: 'Reserved', value: '1'},
    ];

    const getVisits = () => {
        setLoading(true);
        getSlots(startDate, endDate, reserved, auth, Math.max(page, 1)).then((response) => {
            setPage(Math.min(response.pagination.totalPages, page))
            setMaxPage(response.pagination.totalPages);
            const visits = response.data.map((v: { date: string, id: number, vaccination: Vaccination | null }) => {
                return {
                    date: new Date(v.date),
                    id: v.id,
                    vaccination: v.vaccination
                }
            })
            setVisits(visits);
            return;
        }).catch(reason => {
            if (reason instanceof UnauthorizedRequestError) {
                logOut(auth);
                navigate('/loginDoctor');
            } else switch (reason.status) {
                case 422:
                    showErrorModal('Error', 'Validation error');
                    break;
                default:
                    showErrorModal('Error', 'Unknown error');
                    console.log(reason.message);
            }
            setVisits([]);
        }).finally(() => setLoading(false))

    };
    useEffect(() => {
        getVisits();
    }, [startDate, endDate, reserved, page])

    function remove(index: number) {
        deleteVisit(Visits[index], auth).then(() => {
            getVisits();
            return '';
        }).catch((reason => {
            if (reason instanceof UnauthorizedRequestError) {
                logOut(auth);
                navigate('/loginDoctor');
            } else
                return reason.message;
        }));
        return '';
    }

    const vaccinate = (index: number, status: 'COMPLETED' | 'CANCELED') => {
        return vaccinatePatient(Visits[index].id, auth, status)
            .then(() => {
                    getVisits();
                }
            ).catch(reason => {
                if (reason instanceof UnauthorizedRequestError) {
                    logOut(auth);
                    navigate('/loginDoctor');
                } else
                    throw reason
            })
    }

    return (
        <>
            <Container style={{width: '500px', margin: 5}}>
                <Row>Doctor Dashboard</Row>
                <Row style={{padding: '2px'}}>
                    <Col>From:</Col>
                    <Col><DatePicker
                        disabled={loading}
                        onChange={(date: Date) => {
                            setPage(1);
                            onStartDateChange(date)
                        }}
                        minDate={new Date('1990-01-01')}
                        value={startDate}
                        format='dd.MM.y'
                        data-testid='Start'
                        className="col_stretch"
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
                        minDate={new Date('1990-01-02')}
                        value={endDate}
                        format='dd.MM.y'
                        data-testid='End'
                        className="col_stretch"
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
                                    setReserved(e.currentTarget.value)
                                }
                                }
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </Row>
                <Row style={{padding: '2px'}}>
                    <Button style={{width: '150px'}} onClick={() => navigate('/doctor/setSchedule')}>Set
                        schedule</Button>
                </Row>
            </Container>

            {Visits.length === 0 ?
                <div/> :
                <>
                    <Container>
                        <Col
                            className={`d-flex${Visits.length === 0 || loading ? '' : '-nowrap'} justify-content-center`}>
                            {
                                loading ?
                                    <Spinner animation='border'/> :
                                    (
                                        Visits.map((field, index) => {
                                            return <PatientVisitField
                                                key={`visit_${index}`}
                                                visit={field}
                                                index={index}
                                                remove={remove}
                                                vaccinate={vaccinate}
                                            />
                                        })
                                    )}
                        </Col>
                    </Container>
                    <Container>
                        <Row>
                            <Col className='d-flex justify-content-center'><Button disabled={loading || page <= 1}
                                                                                   onClick={() => setPage(page - 1)}> Previous
                                Page</Button></Col>
                            <Col
                                className='d-flex justify-content-center'>{loading ? '...' : `${page} of ${maxPage}`}</Col>
                            <Col className='d-flex justify-content-center'><Button disabled={loading || page >= maxPage}
                                                                                   onClick={() => setPage(page + 1)}> Next
                                Page</Button></Col>
                        </Row>

                    </Container>
                </>}
            {renderErrorModal()}
        </>

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