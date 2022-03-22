import React, {useState} from 'react';
import {Button, Container, Row} from 'react-bootstrap';
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
function DoctorDashboard() {
    const navigate = useNavigate()
    let Visits: Visit[] = [];
    let today = getBeginningOfWeek(new Date());
    today.setHours(0,0,0,0);
    const [startDate, onStartDateChange] = useState(today);
    const [endDate, onEndDateChange] = useState(addDays(today, 6));
    return (
        <div>
            <Container style={{width: "500px", margin: 5}}>
                <Row>
                    Doctor Dashboard
                    <>
                        From:
                        <DatePicker
                        onChange={onStartDateChange}
                        value={startDate}
                        format="dd.MM.y"
                        />
                    </>
                    <>
                        To:
                        <DatePicker
                            onChange={onEndDateChange}
                            value={endDate}
                            format="dd.MM.y"
                        />
                    </>
                </Row>
                <Row>
                    <Button style={{width: "150px"}} onClick={() => navigate('/doctor/setSchedule')}>Set schedule</Button>
                </Row>
            </Container>

            <Container>
                {Visits.map((field, index) => <PatientVisitField visit={field} index={index}/>)}
            </Container>
        </div>

    )
}

export default DoctorDashboard;
