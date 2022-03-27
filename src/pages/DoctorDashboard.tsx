import React, {useState, useEffect } from 'react';
import {Button, ButtonGroup, Col, Container, Row, Spinner, ToggleButton} from 'react-bootstrap';
import PatientVisitField from "../components/PatientVisit";
import {
    /*Routes,
    Route,
    Link, */
    useNavigate,
    /*useLocation,
    Navigate,
    Outlet,*/
} from "react-router-dom";
import {Vaccination, Visit, AuthContextType} from "../components/types";
import {addDays, getBeginningOfWeek} from "../components/dateUtils";
import DatePicker from 'react-date-picker';
import { getSlots } from '../logic/doctorAPI';
import { useAuth } from '../App';

function DoctorDashboard() {
    const navigate = useNavigate()
    let today = getBeginningOfWeek(new Date());
    today.setHours(0,0,0,0);
    const [startDate, onStartDateChange] = useState<Date>(today);
    const [endDate, onEndDateChange] = useState<Date>(addDays(today, 6));
    const [reserved, setReserved] = useState<string>('-1');
    const [page, setPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(10);
    const radios = [
        { name: 'All', value: '-1' },
        { name: 'Free', value: '0' },
        { name: 'Reserved', value: '1' },
    ];
    let auth: AuthContextType = useAuth();
    const sampleInfo: Visit[] = [
        {
            date: new Date("2022-03-29T08:00:00Z"),
            id: 0,
            vaccination: null,
        },
        {
            date: new Date("2022-03-30T08:00:00Z"),
            id: 1,
            vaccination: {
                id: 0,
                status: "Planned",
                patient: {
                    id: 0,
                    firstName: "Adam",
                    lastName: "Abacki",
                    pesel: "12345678901",
                    email: "email@example.com",
                    address: {
                        id: 0,
                        city: "Warszawa",
                        zipCode: "01-234",
                        street: "Przykładowa",
                        houseNumber: 1,
                        localNumber: null,
                    }
                },
                vaccine: {
                    id: 0,
                    name: "Phiser",
                    disease: "Covid-19",
                    requiredDoses: 0,
                },
            }
        },
        {
            date: new Date("2022-03-29T10:00:00Z"),
            id: 0,
            vaccination: null,
        },
    ];
    function getVisits(start: Date | null, finish: Date | null, onlyReserved: string, page: number): Visit[] {
        getSlots(start, finish, onlyReserved, auth.token, page).then((response) => {
            if(response.ok)
                setMaxPage(response.pagination.totalPages);
                return response.data;
        }).catch((reason => {
            switch (reason)
            {
                case 401:
                    console.log("Unauthorised error (invalid or empty Bearer token");
                    break;
                case 422:
                    console.log("Validation error");
                    break;
                default:
                    console.log("Unknown error");
            }
        }))
        return [];
    }
    const [Visits, setVisits] = useState<Visit[]>([]);
    useEffect(() => {
        setVisits(getVisits(startDate, endDate, reserved, page));
    },[startDate, endDate, reserved, page])
    function remove(index: number) {
        Visits.splice(index, 1);
    }

    return (
        <div>
            <Container style={{width: "500px", margin: 5}}>
                <Row>Doctor Dashboard</Row>
                    <Row style={{padding: "2px"}}>
                        <Col>From:</Col>
                        <Col><DatePicker
                        onChange={ (date: Date) => {
                            onStartDateChange(date)
                        }}
                        value={startDate}
                        format="dd.MM.y"
                        /></Col>
                    </Row>
                    <Row style={{padding: "2px"}}>
                        <Col>To:</Col>
                        <Col><DatePicker
                            onChange={(date: Date) => {
                                onEndDateChange(date)
                            }}
                            value={endDate}
                            format="dd.MM.y"
                        /></Col>
                    </Row>
                <Row style={{padding: "2px"}} xs={"auto"}>
                    <ButtonGroup>
                        {radios.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`radio-${idx}`}
                                type="radio"
                                variant="outline-secondary"
                                name="radio"
                                value={radio.value}
                                checked={reserved === radio.value}
                                onChange={(e) => setReserved(e.currentTarget.value)}
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </Row>
                <Row style={{padding: "2px"}}>
                    <Button style={{width: "150px"}} onClick={() => navigate('/doctor/setSchedule')}>Set schedule</Button>
                </Row>
            </Container>

            <Container className="d-flex justify-content-center">
                {Visits.length === 0 ? <Spinner animation="border"/> : Visits.map((field, index) =>
                    <PatientVisitField key={`visit_${index}`} visit={field} index={index} remove={remove}/>
                )}
            </Container>
            <Container>
                <Row>
                    <Col className="d-flex justify-content-center"><Button disabled={page<=1} onClick={() => setPage(page - 1)}> Previous Page</Button></Col>
                    <Col className="d-flex justify-content-center">{page}</Col>
                    <Col className="d-flex justify-content-center"><Button disabled={page>=maxPage} onClick={() => setPage(page + 1)}> Next Page</Button></Col>
                </Row>

            </Container>
        </div>

    )
}

export default DoctorDashboard;
