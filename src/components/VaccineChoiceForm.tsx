import React, { useState } from 'react';
import { Vaccine } from '../types/vaccination'
import './VaccineChoiceForm.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Row, Col } from 'react-bootstrap';

interface VaccineChoiceFormProps {
    onChoiceCallback: (vaccine: Vaccine) => void;
    vaccines: Vaccine[]
}

function VaccineChoiceForm(props: VaccineChoiceFormProps) {
    let [vaccineFilter, setVaccineFilter] = useState<String>('All');
    const onChoiceCallback = props.onChoiceCallback;
    const vaccines = props.vaccines;
    let diseases = Array.from(new Set(vaccines.map((x) => x.disease)));

    const filterVaccines = (value: Vaccine, index: number, 
            array: Vaccine[]): boolean => {
        return (vaccineFilter === 'All') ? true : value.disease === vaccineFilter;
    }

    const handleSelectChange = (selectObject: React.FormEvent<HTMLSelectElement>): void => {
        setVaccineFilter(selectObject.currentTarget.value);
    }

    return (
        <Row>
        <Col>
            <h1 className='noselect'>Available vaccines</h1>
            <div className='gap'/>
            <div className='d-flex justify-content-end'>
                <div><h2 className='d-inline noselect'>Disease:</h2></div>
                <div>
                    <select className='d-inline mx-5 align-' onChange={handleSelectChange}>
                        <option value='All'>All</option>
                        {diseases.map((x) => <option value={x}>{x}</option>)}
                    </select>
                </div>
            </div>
        </Col>
        <Col className='scrollable-box'>
            <TransitionGroup>
                {vaccines.filter(filterVaccines).map((vaccine, i) =>
                <CSSTransition
                    key={'item-' + (i+1).toString()}
                    timeout={200}
                    classNames='item-button'>
                    <div>
                    <button className='btn btn-light btn-rounded btn-outline-dark my-3 w-100'
                        style={{width: '400px'}}
                        onClick={() => onChoiceCallback(vaccine)}>
                        <h4 className='noselect'>Vaccine: {vaccine.name}</h4>
                        <h4 className='noselect'>Disease: {vaccine.disease}</h4>
                        <h4 className='noselect'>Required doses: {vaccine.requiredDoses}</h4>
                    </button>
                    </div>
                </CSSTransition>)}
            </TransitionGroup>
        </Col>
    </Row>);
}

export default VaccineChoiceForm;