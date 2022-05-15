import { useEffect, useState } from "react";
import { Address, Doctor, Patient } from "../types/users";
import { PatientVaccination, Timeslot, Vaccine } from "../types/vaccination";
import useVaccinationDetailsModal from "./modals/useVaccinationDetailsModal";
import PaginationMenu from "./PaginationMenu";
import './PatientVaccinationList.css';

export default function PatientVaccinationList() {
    const [vaccinations, setVaccinations] = useState<PatientVaccination[]>([]);
    const [isLoading, setLoadingStatus] = useState<Boolean>(true);
    const [currPage, setCurrPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(3);
    const [showDetails, renderModal] = useVaccinationDetailsModal();

    useEffect(() => {
        setLoadingStatus(true);
        setTimeout(() => {
           loadVaccinations();
           setLoadingStatus(false);
        }, 1500);
    }, [currPage])

    function renderVaccinationRow(vaccination: PatientVaccination) {
        const textClass = vaccination.status + '-text';
        return (<tr className='data-row'
                onClick={() => showDetails(vaccination)}>
            <td className={textClass}>{vaccination.vaccinationSlot.date.toLocaleDateString()}</td>
            <td className={textClass}>{vaccination.vaccinationSlot.date.toLocaleTimeString()}</td>
            <td className={textClass}>{vaccination.vaccine.name}</td>
            <td className={textClass}>{vaccination.status}</td>
        </tr>)
    }


    function loadVaccinations() {
        setVaccinations([
        getVaccination('Completed'),
        getVaccination('Planned'),
        getVaccination('Canceled'),
        getVaccination('Planned'),
        getVaccination('Canceled'),
        getVaccination('Completed'),
        getVaccination('Planned'),
        getVaccination('Canceled'),
        getVaccination('Completed'),
        getVaccination('Completed'),
        getVaccination('Planned')]);
    }

    function renderVaccinationTable() {
        return (<>
            {isLoading &&
                <div style={{width: '1000px', textAlign: 'center'}}>
                    <div className='center-text spinner-border'
                    style={{width: '100px', height: '100px'}} 
                    id='loadingIndicator'></div>
                </div>}
            {!isLoading && <table className='table table-hover'>
                <thead className='thead-dark noselect'>
                    <tr>
                        <th>Date</th>
                        <th>Appointment time</th>
                        <th>Vaccine</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody className = 'noselect'>
                    {vaccinations.map(renderVaccinationRow)}
                </tbody>
            </table>}
        </>);
    }

    return (<>
        {renderModal()}
        {renderVaccinationTable()} 
        <div style={{height: '30px'}}/>
        <PaginationMenu
            currentPage = {currPage} 
            pageCount = {pageCount}
            setPage = {setCurrPage}
            modifyPage = {(pageDelta) => setCurrPage((page) => page+pageDelta)}
        />
        <div style={{height: '10px'}}/>
    </>);
}

function getVaccination(status: 'Completed' | 'Canceled' | 'Planned'): PatientVaccination {
    const address: Address = {
        id: 12,
        city: 'Warsaw',
        zipCode: '63-232',
        street: 'Wawelska',
        houseNumber: '12',
        localNumber: null
    }
    const patient: Patient = {
       id: 2,
       email: 'email@email.com' ,
       firstName: 'John',
       lastName: 'Doe',
       pesel: '12345678912',
       address: address
    }
    const doctor: Doctor = {
        id: 3,
        email: 'doctor@doctor.com',
        firstName: 'Joe',
        lastName: 'Mama'
    }
    const vaccine: Vaccine = {
        id: 4,
        name: 'Modafelex',
        disease: 'Flu',
        requiredDoses: 2
    }
    const slot: Timeslot = {
        id: 123,
        date: new Date()
    }
    const vaccination: PatientVaccination = {
        id: 12,
        vaccine: vaccine,
        vaccinationSlot: slot,
        status: status,
        patient: patient,
        doctor: doctor
    }
    return vaccination;
}