import React from "react";
import {Visit} from "./types";
import {Button, Row} from "react-bootstrap";
import moment from "moment";
import { deleteVisit } from "../logic/doctorAPI";

interface patientVisitProps{
    visit: Visit;
    index: number;
    remove: (index: number) => void
}
const PatientVisitField: React.FC<patientVisitProps> = (props) => {
    return <Row key={`visit_${props.index}`} className={props.visit.vaccination!= null? 'occupied-visit' : 'free-visit'}>
        {`${moment(props.visit.date).format("hh:mm DD.MM.YYYY")} ${props.visit.vaccination!= null ? "Patient visit" : "Free"}`}
        <Button onClick={() => {
            deleteVisit(props.visit, "");
            props.remove(props.index);
        }}>&#8722;</Button>
    </Row>
}

export default PatientVisitField;