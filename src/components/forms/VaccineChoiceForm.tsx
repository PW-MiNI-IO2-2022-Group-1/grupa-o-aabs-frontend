import React, { useEffect, useState } from 'react';
import { Vaccine } from '../../types/vaccination'
import '../VaccineChoiceForm.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Row, Col } from 'react-bootstrap';
import { useAuth } from '../AuthComponents';
import { getAvailableVaccines } from '../../logic/patientApi';
import { UnauthorizedRequestError } from '../../types/requestErrors';
import { useSimpleModal } from '../modals/useSimpleModal';
import { logOut } from '../../logic/login';

interface VaccineChoiceFormProps {
    onChoiceCallback: (vaccine: Vaccine) => void;
}

function VaccineChoiceForm(props: VaccineChoiceFormProps) {
    const auth = useAuth();

    const [vaccineFilter, setVaccineFilter] = useState<String>('All');
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [showModal, renderModal] = useSimpleModal();
    const onChoiceCallback = props.onChoiceCallback;

    let diseases = Array.from(new Set(vaccines.map((x) => x.disease)));

    useEffect(() => {
        getAvailableVaccines(auth).then(setVaccines).catch(error => {
            if(error instanceof UnauthorizedRequestError)
                showModal('Error', 'You are not authorized', () => logOut(auth));
            else
                showModal('Error', 'Unexpected error');
        });
    }, [auth, showModal]);

    const filterVaccines = (value: Vaccine, index: number, 
            array: Vaccine[]): boolean => {
        return (vaccineFilter === 'All') ? true : value.disease === vaccineFilter;
    }

    const handleSelectChange = (selectObject: React.FormEvent<HTMLSelectElement>): void => {
        setVaccineFilter(selectObject.currentTarget.value);
    }

    return (<>
        {renderModal()}
        <Row>
            <Col>
                <h1 className='noselect'>Available vaccines</h1>
                <div className='gap'/>
                <div className='d-flex justify-content-end'>
                    <div><h2 className='d-inline noselect'>Disease:</h2></div>
                    <div>
                        <select className='d-inline mx-5 align-' onChange={handleSelectChange}
                            style={{width: '250px'}}>
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
        </Row>
    </>);
}

export default VaccineChoiceForm;