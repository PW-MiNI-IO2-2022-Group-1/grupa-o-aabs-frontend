import React, {useState} from "react";
import {Visit} from "./types";
import {Button, Row, Col, Modal} from "react-bootstrap";
import moment from "moment";
import { deleteVisit } from "../logic/doctorAPI";

interface patientVisitProps{
    visit: Visit;
    index: number;
    remove: (index: number) => void
}
const PatientVisitField: React.FC<patientVisitProps> = (props) => {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleHide = () => setShow(false);
    const vaccInfo = props.visit.vaccination == null ? "No patient assigned" :
        <><>Vaccine:</><br/>
         <>{`- Name: ${props.visit.vaccination.vaccine.name}`}</> <br/>
         <>{`- Disease: ${props.visit.vaccination.vaccine.disease}`}</><br/>
         <>{`- Required doses: ${props.visit.vaccination.vaccine.requiredDoses}`}</><br/>
         <>{`Patient: ${props.visit.vaccination.patient?.firstName} ${props.visit.vaccination.patient?.lastName},
         PESEL: ${props.visit.vaccination.patient?.pesel}`}</><br/>
         <>{`Status: ${props.visit.vaccination.status}`}</><br/></>
    return <Row style={{padding: "2px"}} key={`visit_${props.index}`} className={props.visit.vaccination!= null? 'occupied-visit' : 'free-visit'}>
        <Col ><Row>{`${moment(props.visit.date).format("hh:mm DD.MM.YYYY")}`}</Row>
            <Row>{`${props.visit.vaccination!= null ? "Patient visit" : "Free"}`}</Row></Col>
        <Col xs="auto"><Button onClick={handleShow}>More info</Button></Col>
        <Modal show={show} onhide={handleHide} >
            <Modal.Header closeButton>
            <Modal.Title>Visit info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {`Date: ${moment(props.visit.date).format("DD.MM.YYYY HH:MM")}`}
                <br/>
                {vaccInfo}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {
                    if(props.visit.vaccination)
                    {
                        console.log("Unable to delete - time slot already reserved");
                    }
                    else
                    {
                        if(props.visit.date.getTime() -  (new Date()).getTime() <= 86400000)
                        {
                            console.log("Unable to delete - slot is too near");
                        }
                        else
                        {
                            deleteVisit(props.visit, "").then((response) => {
                                if(response.ok)
                                {
                                    props.remove(props.index);
                                }
                            }).catch((reason => {
                                console.log(reason);
                            }));
                        }
                    }
                }}>Delete</Button>
                <Button variant="primary" onClick={handleHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    </Row>
}

export default PatientVisitField;