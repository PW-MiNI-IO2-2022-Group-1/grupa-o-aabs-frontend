import { useEffect, useState } from "react";
import { logOut } from "../logic/login";
import { getAvailableVaccines, getVaccinationHistory } from "../logic/patientApi";
import { UnauthorizedRequestError } from "../types/requestErrors";
import { PatientVaccination } from "../types/vaccination";
import { useAuth } from "./AuthComponents";
import { useSimpleModal } from "./modals/useSimpleModal";
import useVaccinationDetailsModal from "./modals/useVaccinationDetailsModal";
import PaginationMenu from "./PaginationMenu";
import './PatientVaccinationList.css';

export default function PatientVaccinationList() {
    const auth = useAuth();
    const [showModal, renderErrorModal] = useSimpleModal();
    const [vaccinations, setVaccinations] = useState<PatientVaccination[]>([]);
    const [isLoading, setLoadingStatus] = useState<Boolean>(true);
    const [currPage, setCurrPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(1);
    const [showDetails, renderModal] = useVaccinationDetailsModal();

    const [diseaseFilter, setDiseaseFilter] = useState<string>('All');
    const [diseases, setDiseases] = useState<string[]>([]);

    useEffect(() => {
       getAvailableVaccines(auth).then((vaccines) => {
           const diseases = vaccines.map(vaccine => vaccine.disease);
           const uniqueDiseases = Array.from(new Set(diseases));
           setDiseases(uniqueDiseases);
       }).catch(error => {
            if(error instanceof UnauthorizedRequestError)
                showModal('Error', 'You are not authorized', () => logOut(auth));
            else
                showModal('Error', 'Unexpected error');
       })
    }, []);

    useEffect(() => {
        setLoadingStatus(true);
        getVaccinationHistory(auth, currPage).then((data) => {
            setVaccinations(data[0]);
            setPageCount(data[1]);
            setLoadingStatus(false);
        }).catch(error => {
            if(error instanceof UnauthorizedRequestError)
                showModal('Error', 'You are not authorized', () => logOut(auth));
            else
                showModal('Error', 'Unexpected error');
        })
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

    const handleSelectChange = (selectObject: React.FormEvent<HTMLSelectElement>): void => {
        setDiseaseFilter(selectObject.currentTarget.value);
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
                    {vaccinations.filter((vaccination => {
                        return (diseaseFilter === 'All' 
                            || vaccination.vaccine.disease === diseaseFilter);
                    })).map(renderVaccinationRow)}
                </tbody>
            </table>}
        </>);
    }

    return (<>
        {renderErrorModal()}
        {renderModal()}
        <label>Disease</label>
        <select className='d-inline mx-5 align-' onChange={handleSelectChange}
                            style={{width: '250px'}}>
                            <option value='All'>All</option>
                            {diseases.map((x) => <option value={x}>{x}</option>)}
                        </select>
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