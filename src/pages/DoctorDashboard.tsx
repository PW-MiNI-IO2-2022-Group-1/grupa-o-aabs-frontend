import React, {useState, useEffect } from 'react';
import {Button, Col, Container, Row} from 'react-bootstrap';
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
import {Visit} from "../components/types";
import {addDays, getBeginningOfWeek} from "../components/dateUtils";
import DatePicker from 'react-date-picker';
import { getSlots } from '../logic/doctorAPI';
import useAuth from '../App';

function DoctorDashboard() {
    const navigate = useNavigate()
    let today = getBeginningOfWeek(new Date());
    today.setHours(0,0,0,0);
    const [startDate, onStartDateChange] = useState(today);
    const [endDate, onEndDateChange] = useState(addDays(today, 6));
    const [reserved, setReserved] = useState("");
    const [page, setPage] = useState(1);
    let maxPage = 30;
    function getVisits(start: Date | null, finish: Date | null, onlyReserved: string | null, page: number): Visit[] {
        //var auth = useAuth();
        const myVisits  = getSlots(start, finish, onlyReserved, "", page)
        console.log(start);
        console.log(finish);
        return [];
    }
    let Visits: Visit[] = [];
    useEffect(() => {
        Visits = getVisits(startDate, endDate, reserved, page);
    })
    function remove(index: number) {
        Visits.splice(index, 1);
    }
    return (
        <div>
            <Container style={{width: "500px", margin: 5}}>
                <Row>Doctor Dashboard</Row>
                    <Row>
                        <Col>From:</Col>
                        <Col><DatePicker
                        onChange={ (date: Date) => {
                            onStartDateChange(date)
                        }}
                        value={startDate}
                        format="dd.MM.y"
                        /></Col>
                    </Row>
                    <Row>
                        <Col>To:</Col>
                        <Col><DatePicker
                            onChange={(date: Date) => {
                                onEndDateChange(date)
                            }}
                            value={endDate}
                            format="dd.MM.y"
                        /></Col>
                    </Row>
                <Row>
                    <Button style={{width: "150px"}} onClick={() => navigate('/doctor/setSchedule')}>Set schedule</Button>
                </Row>
            </Container>

            <Container>
                {Visits.map((field, index) => <PatientVisitField visit={field} index={index} remove={remove}/>)}
            </Container>
            <Container>
                <Row>
                    <Col><Button disabled={page<=1} onClick={() => setPage(page - 1)}> Previous Page</Button></Col>
                    <Col>{page}</Col>
                    <Col><Button disabled={page>=maxPage} onClick={() => setPage(page + 1)}> Next Page</Button></Col>
                </Row>

            </Container>
        </div>

    )
}

export default DoctorDashboard;
