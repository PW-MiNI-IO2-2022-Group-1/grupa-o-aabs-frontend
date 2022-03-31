import React, {useState} from 'react';
import {Visit} from '../types/vaccination';
import {Button, Row, Col, Modal} from 'react-bootstrap';
import moment from 'moment';

interface patientVisitProps{
    visit: Visit;
    index: number;
    remove: (index: number) => void;
}

const PatientVisitField: React.FC<patientVisitProps> = (props) => {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleHide = () => setShow(false);
    const handleDelete = () => {
        if(props.visit.vaccination) {
            console.log('Unable to delete - time slot already reserved');
        }
        else
        {
            if(props.visit.date.getTime() -  (new Date()).getTime() <= 86400000)
                console.log('Unable to delete - slot is too near');
            else
                props.remove(props.index);
        }
    }
    const vaccInfo = props.visit.vaccination == null ? 'No patient assigned' :
        `Vaccine:
         - Name: ${props.visit.vaccination.vaccine.name}
         - Disease: ${props.visit.vaccination.vaccine.disease}
         - Required doses: ${props.visit.vaccination.vaccine.requiredDoses}
         Patient: ${props.visit.vaccination.patient?.firstName} ${props.visit.vaccination.patient?.lastName}
         PESEL: ${props.visit.vaccination.patient?.pesel}
         Status: ${props.visit.vaccination.status}`;
    return <Row style={{padding: '2px'}}>
        <Col className={(props.visit.vaccination!= null? `${props.visit.vaccination.status}Status` : 'FreeStatus') + ' visit'}><Row>{`${moment(props.visit.date).format('hh:mm DD.MM.YYYY')}`}</Row>
            <Row>{`${props.visit.vaccination!= null ? 'Patient visit' : 'Free'}`}</Row></Col>
        <Col xs='auto' className='d-flex justify-content-center'><Button onClick={handleShow}>More info</Button></Col>
        <Modal show={show}>
            <Modal.Header closeButton onClick={handleHide}>
            <Modal.Title>Visit info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {`Date: ${moment(props.visit.date).format('DD.MM.YYYY hh:mm')}`}
                <br/>
                {vaccInfo.split('\n').map((line) => {
                      return (
                          <>{line}
                          <br/>
                          </>
                      )
                })}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={handleDelete}>Delete</Button>
                <Button variant='primary' onClick={handleHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    </Row>
}

export default PatientVisitField;