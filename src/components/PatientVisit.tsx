import React from "react";
import {Visit} from "./types";
import {Row} from "react-bootstrap";
import moment from "moment";

interface patientVisitProps{
    visit: Visit;
    index: number;
}
const PatientVisitField: React.FC<patientVisitProps> = (props) => {
    return <Row key={`visit_${props.index}`} className={props.visit.isOccupied? 'occupied-visit' : 'free-visit'}>
        {`${moment(props.visit.date).format("hh:mm DD.MM.YYYY")} ${props.visit.isOccupied ? "Patient visit" : "Free"}`}
    </Row>
}

export default PatientVisitField;