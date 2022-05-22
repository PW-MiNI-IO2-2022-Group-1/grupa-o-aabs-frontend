import { useState } from "react";
import StageChoice from "../components/StageChoice";
import VaccinationDateChoiceForm from "../components/forms/VaccinationDateChoiceForm";
import VaccineChoiceForm from "../components/forms/VaccineChoiceForm";
import { Timeslot, Vaccine } from "../types/vaccination";
import './VaccineRegistrationPage.css';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import moment from 'moment';
import { useNavigate } from "react-router";
import { reserveTimeslot } from "../logic/patientApi";
import { useAuth } from "../components/AuthComponents";
import { useSimpleModal } from "../components/modals/useSimpleModal";
import { UnauthorizedRequestError } from '../types/requestErrors';
import { logOut } from "../logic/login";

enum VaccineRegistrationStage {
    vaccineChoice,
    dateChoice,
    confirmation
}

export default function VaccineRegistrationPage() {
    const auth = useAuth();
    const navigate = useNavigate();

    const [chosenVaccine, setChosenVaccine] = useState<Vaccine | null>(null);
    const [chosenTimeslot, setChosenTimeslot] = useState<Timeslot | null>(null);
    const [showModal, renderModal] = useSimpleModal();


    const onConfirm = () => {
        if(chosenTimeslot == null || chosenVaccine == null)
            return;

        reserveTimeslot(auth, chosenTimeslot, chosenVaccine).then(() => {
            showModal('Success', 'You have successfully register for the vaccine', 
                () => navigate('/patient'));
        }).catch(error => {
            if(error instanceof UnauthorizedRequestError)
                showModal('Error', 'You are not authorized', () => logOut(auth));
            else
                showModal('Error', 'Unexpected error');
        });
    }


    const getStage = (): VaccineRegistrationStage => {
        if(chosenVaccine == null)
            return VaccineRegistrationStage.vaccineChoice;
        if(chosenTimeslot == null)
            return VaccineRegistrationStage.dateChoice;
        return VaccineRegistrationStage.confirmation;
    }

    const setStage = (stage: VaccineRegistrationStage): void => {
        if(stage === VaccineRegistrationStage.dateChoice) {
            setChosenTimeslot(null);
        }
        if(stage === VaccineRegistrationStage.vaccineChoice) {
            setChosenTimeslot(null);
            setChosenVaccine(null);
        }
    }

    const renderVaccineChoiceSubpage = (): JSX.Element => {
        return (<div className='subpage-container' key='vaccineSubpage'>
            <VaccineChoiceForm onChoiceCallback={setChosenVaccine}/> 
        </div>);
    }

    const renderDateChoiceSubpage = (): JSX.Element => {
        if(chosenVaccine == null)
            return (<></>);

        return (<div className='subpage-container' key='dateSubpage'>
            <VaccinationDateChoiceForm vaccine={chosenVaccine}
                onTimeslotChoiceCallback={setChosenTimeslot}/>
        </div>);
    }

    const renderConfirmationSubpage = (): JSX.Element => {
        if(chosenVaccine == null || chosenTimeslot == null)
            return (<></>);

        return (<>
            {renderModal()}
            <div className='subpage-container' key='confirmationSubpage'>
                <div style={{textAlign: 'center'}}>
                    <h1>Vaccine: {chosenVaccine.name} ({chosenVaccine.disease})</h1>
                    <h1>Appointment date: {(moment(chosenTimeslot.date)).format('DD-MM-YYYY')}</h1>
                    <h1>Appointment time: {(moment(chosenTimeslot.date)).format('HH:mm')}</h1>
                    <div className='gap'/>
                    <div className='d-flex justify-content-center'>
                    <button className='btn btn-light btn-outline-dark btn-rounded' 
                        onClick={onConfirm}><h3>Confirm</h3></button>
                    </div>
                </div>
            </div>
        </>);
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
            <StageChoice<VaccineRegistrationStage>
                onChoiceCallback={setStage}
                stageNames={stageNames}
                currentStage={currentStage}
            />
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