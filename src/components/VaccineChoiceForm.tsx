import React, { useState } from 'react';
import { Vaccine } from '../types/vaccination'
import './VaccineChoiceForm.css';

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

    return (<>
        <h1 className='noselect'>Available vaccines</h1>
        <div className='gap'/>
        <div className='d-flex justify-content-end'>
            <div><h2 className='d-inline noselect'>Disease:</h2></div>
            <div><select className='d-inline mx-5 align-' onChange={handleSelectChange}>
                <option value='All'>All</option>
                {diseases.map((x) => <option value={x}>{x}</option>)}
            </select></div>
        </div>
        {vaccines.filter(filterVaccines).map((vaccine, i) =>
        <button style={{padding: 0, border: 'none', background: 'none'}}>
            <div className='vaccine-item' onClick={() => onChoiceCallback(vaccine)}>
                <h3 className='text-light noselect'>Vaccine: {vaccine.name}</h3>
                <h3 className='text-light noselect'>Disease: {vaccine.disease}</h3>
                <h3 className='text-light noselect'>Required doses: {vaccine.requiredDoses}</h3>
            </div>
        </button>)}
    </>);
}

export default VaccineChoiceForm;