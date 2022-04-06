import { useState } from "react";
import StageChoice from "../components/StageChoice";
import VaccinationDateChoiceForm from "../components/VaccinationDateChoiceForm";
import VaccineChoiceForm from "../components/VaccineChoiceForm";
import { Vaccine } from "../types/vaccination";
import moment from 'moment';

enum VaccineRegistrationStage {
    vaccineChoice,
    dateChoice
}

function VaccineRegistrationPage() {
    let [chosenVaccine, setChosenVaccine] = useState<Vaccine | null>(null);
    let [chosenDate, setChosenDate] = useState<Date | null>(null);

    const vaccines: Array<Vaccine> = [
        { id: 1, name: 'Moderna', disease: 'Covid-19', requiredDoses: 2},
        { id: 2, name: 'Johnson & Johnson', disease: 'Covid-19', requiredDoses: 2},
        { id: 3, name: 'Pfizer', disease: 'Covid-19', requiredDoses: 4},
        { id: 4, name: 'AstraZeneca', disease: 'Covid-19', requiredDoses: 3},
        { id: 5, name: 'Flucelvax Quadrivalent', disease: 'Flu', requiredDoses: 1},
        { id: 6, name: 'Flu killer', disease: 'Flu', requiredDoses: 1},
    ];

    const onVaccineChoice = (vaccine: Vaccine) => setChosenVaccine(vaccine);
    const onDateChoice = (date: Date) => setChosenDate(date);
    const onConfirm = () => {
        console.log(chosenVaccine);
        console.log(chosenDate);
    }

    const getStageInfo = (): [String[], number] => {
        let stages: String[] = ['Vaccine', 'Date', 'Confirmation'];
        let currentStage = 0;
        if(chosenVaccine != null)
            currentStage += 1;
        if(chosenDate != null)
            currentStage += 1;
        return [stages, currentStage];
    }

    const setStageCallback = (stageNumber: number): void => {
        if(stageNumber < 1)
            setChosenVaccine(null);
        if(stageNumber < 2)
            setChosenDate(null);
    }

    let [stages, currentStage] = getStageInfo();
 
    if(chosenVaccine == null) {
        return (<>
            <div className='mb-5'>
                <StageChoice onChoiceCallback={setStageCallback}
                    stages={stages} currentStage={currentStage}></StageChoice>
            </div>
            <VaccineChoiceForm 
                onChoiceCallback={onVaccineChoice}
                vaccines={vaccines}/> 
        </>);
    }
    else if(chosenDate == null) {
        return (<>
            <div className='mb-5'>
                <StageChoice onChoiceCallback={setStageCallback}
                    stages={stages} currentStage={currentStage}></StageChoice>
            </div>
            <VaccinationDateChoiceForm vaccine={chosenVaccine}
                onDateChoiceCallback={setChosenDate}/>
        </>);
    }
    else {
        return (<>
            <div className='mb-5'>
                <StageChoice onChoiceCallback={setStageCallback}
                    stages={stages} currentStage={currentStage}></StageChoice>
            </div>
            <div>
                <h1>Vaccine: {chosenVaccine.name} ({chosenVaccine.disease})</h1>
                <h1>Appointment date: {(moment(chosenDate)).format('DD-MM-YYYY')}</h1>
                <h1>Appointment time: {(moment(chosenDate)).format('HH:mm')}</h1>
                <div className='gap'/>
                <div className='d-flex justify-content-center'>
                <button className='btn btn-primary' onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </>);
    }
}

export default VaccineRegistrationPage;