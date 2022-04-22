import React, {useState} from 'react';
import {Visit} from '../types/vaccination';
import {Button, Row, Col, Modal} from 'react-bootstrap';
import moment from 'moment';

interface patientVisitProps {
    visit: Visit;
    index: number;
    remove: (index: number) => string;
}

const PatientVisitField: React.FC<patientVisitProps> = (props) => {
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const handleShow = () => setShow(true);
    const handleHide = () => {
        setError('');
        setShow(false);
    }
    const handleDelete = () => {
        let errorMsg = ''
        if (props.visit.vaccination != null) {
            errorMsg = 'Unable to delete - time slot already reserved';
        } else {
            if (props.visit.date.getTime() - (new Date()).getTime() <= 86400000)
                errorMsg = 'Unable to delete - slot is too near (less than 24 hours away)';
            else
                errorMsg = props.remove(props.index);
        }
        if (errorMsg === '')
            setShow(false);
        else
            setError(errorMsg);
    }
    const vaccInfo = props.visit.vaccination == null ? 'No patient assigned' :
        `${props.visit.vaccination.vaccine === undefined || props.visit.vaccination.vaccine === null ?
            'Vaccine not chosen' :
            `Vaccine:
            - Name: ${props.visit.vaccination.vaccine.name}
            - Disease: ${props.visit.vaccination.vaccine.disease}
            - Required doses: ${props.visit.vaccination.vaccine.requiredDoses}`}
            Patient: ${props.visit.vaccination.patient?.firstName} ${props.visit.vaccination.patient?.lastName}
            PESEL: ${props.visit.vaccination.patient?.pesel}
            Status: ${props.visit.vaccination.status}`;
    return <Row style={{padding: '2px'}}>
        <Col
            className={(props.visit.vaccination != null ? `${props.visit.vaccination.status}Status` : 'FreeStatus') + ' visit'}><Row>{`${moment(props.visit.date).format('HH:mm DD.MM.YYYY')}`}</Row>
            <Row>{`${props.visit.vaccination != null ? 'Patient visit' : 'Free'}`}</Row></Col>
        <Col xs='auto' className='d-flex justify-content-center'><Button onClick={handleShow}>More info</Button></Col>
        <Modal show={show}>
            <Modal.Header closeButton onClick={handleHide}>
                <Modal.Title>Visit info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {`Date: ${moment(props.visit.date).format('DD.MM.YYYY HH:mm')}`}
                <br/>
                {vaccInfo.split('\n').map((line) => {
                    return (
                        <>{line}
                            <br/>
                        </>
                    )
                })}
                <>{error === '' ? '' : <><br/>{error}</>}</>
            </Modal.Body>
            <Modal.Footer>

                <Button variant='secondary' onClick={handleDelete}>Delete</Button>
                <Button variant='primary' onClick={handleHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    </Row>
}

export default PatientVisitField;