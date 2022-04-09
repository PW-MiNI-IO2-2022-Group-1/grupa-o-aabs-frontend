import { useState } from "react";
import StageChoice from "../components/StageChoice";
import VaccinationDateChoiceForm from "../components/VaccinationDateChoiceForm";
import VaccineChoiceForm from "../components/VaccineChoiceForm";
import { Vaccine } from "../types/vaccination";
import './VaccineRegistrationPage.css';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import moment from 'moment';

enum VaccineRegistrationStage {
    vaccineChoice,
    dateChoice,
    confirmation
}

function VaccineRegistrationPage() {
    const [chosenVaccine, setChosenVaccine] = useState<Vaccine | null>(null);
    const [chosenDate, setChosenDate] = useState<Date | null>(null);

    const vaccines: Array<Vaccine> = [
        { id: 1, name: 'Moderna', disease: 'Covid-19', requiredDoses: 2},
        { id: 2, name: 'Johnson & Johnson', disease: 'Covid-19', requiredDoses: 2},
        { id: 3, name: 'Pfizer', disease: 'Covid-19', requiredDoses: 4},
        { id: 4, name: 'AstraZeneca', disease: 'Covid-19', requiredDoses: 3},
        { id: 5, name: 'Flucelvax Quadrivalent', disease: 'Flu', requiredDoses: 1},
        { id: 6, name: 'Flu killer', disease: 'Flu', requiredDoses: 1},
    ];

    const onConfirm = () => {
        console.log(chosenVaccine);
        console.log(chosenDate);
    }

    const getStage = (): VaccineRegistrationStage => {
        if(chosenVaccine == null)
            return VaccineRegistrationStage.vaccineChoice;
        if(chosenDate == null)
            return VaccineRegistrationStage.dateChoice;
        return VaccineRegistrationStage.confirmation;
    }

    const setStage = (stage: VaccineRegistrationStage): void => {
        if(stage === VaccineRegistrationStage.dateChoice) {
            setChosenDate(null);
        }
        if(stage === VaccineRegistrationStage.vaccineChoice) {
            setChosenDate(null);
            setChosenVaccine(null);
        }
    }

    const renderVaccineChoiceSubpage = (): JSX.Element => {
        return (<div className='subpage-container' key='vaccineSubpage'>
            <VaccineChoiceForm onChoiceCallback={setChosenVaccine}
                vaccines={vaccines}/> 
        </div>);
    }

    const renderDateChoiceSubpage = (): JSX.Element => {
        if(chosenVaccine == null)
            return (<></>);

        return (<div className='subpage-container' key='dateSubpage'>
            <VaccinationDateChoiceForm vaccine={chosenVaccine}
                onDateChoiceCallback={setChosenDate}/>
        </div>);
    }

    const renderConfirmationSubpage = (): JSX.Element => {
        if(chosenVaccine == null || chosenDate == null)
            return (<></>);

        return (<div className='subpage-container' key='confirmationSubpage'>
            <div style={{textAlign: 'center'}}>
                <h1>Vaccine: {chosenVaccine.name} ({chosenVaccine.disease})</h1>
                <h1>Appointment date: {(moment(chosenDate)).format('DD-MM-YYYY')}</h1>
                <h1>Appointment time: {(moment(chosenDate)).format('HH:mm')}</h1>
                <div className='gap'/>
                <div className='d-flex justify-content-center'>
                <button className='btn btn-light btn-outline-dark btn-rounded' 
                    onClick={onConfirm}><h3>Confirm</h3></button>
                </div>
            </div>
        </div>);
    }

    const stageNames = new Map<VaccineRegistrationStage, String>([
        [VaccineRegistrationStage.vaccineChoice, 'Vaccine'],
        [VaccineRegistrationStage.dateChoice, 'Date'],
        [VaccineRegistrationStage.confirmation, 'Confirmation']
    ]);

    const stageRenderFunctions = new Map<VaccineRegistrationStage, () => JSX.Element>([
        [VaccineRegistrationStage.vaccineChoice, renderVaccineChoiceSubpage],
        [VaccineRegistrationStage.dateChoice, renderDateChoiceSubpage],
        [VaccineRegistrationStage.confirmation, renderConfirmationSubpage]
    ]);

    const currentStage = getStage();
    const renderFunc = stageRenderFunctions.get(currentStage);
   
    return (<div>
        <div className='mb-5'>
            <StageChoice<VaccineRegistrationStage> onChoiceCallback={setStage}
                stageNames={stageNames} currentStage={currentStage}></StageChoice>
        </div>
        <SwitchTransition>
            <CSSTransition
                timeout={200} 
                classNames='subpage-container'
                key={currentStage.toString()}>
                {renderFunc !== undefined && renderFunc()} 
            </CSSTransition>
        </SwitchTransition>
    </div>);
}

export default VaccineRegistrationPage;