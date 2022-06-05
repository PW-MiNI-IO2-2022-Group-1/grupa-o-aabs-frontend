import {Button, Col, Container, Row, Table} from "react-bootstrap";
import PaginationMenu from "../components/PaginationMenu";
import {useAuth} from "../components/AuthComponents";
import {useEffect, useState} from "react";
import {UnauthorizedRequestError} from "../types/requestErrors";
import {logOut} from "../logic/login";
import {useSimpleModal} from "../components/modals/useSimpleModal";
import * as API from "../logic/adminAPI";
import moment from "moment";
import {Vaccine} from "../types/vaccination";
import {Doctor, Patient} from "../types/users";
import AdminVaccinationForm, {VaccinationFilterData} from "../components/forms/AdminVaccinationsForm";
import {useNavigate} from "react-router-dom";



function AdminVaccinationsPage() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [showErrorModal, renderErrorModal] = useSimpleModal();
    const [showInfoModal, renderInfoModal] = useSimpleModal();
    const [vaccinations, setVaccinations] = useState<Object[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const defaultFilter = {
        doctorId: undefined,
        patientId: undefined,
        disease: undefined,
    }
    const [page, setPage] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [filterData, setFilterData] = useState<VaccinationFilterData>(defaultFilter);

    const handleSubmit = (data: VaccinationFilterData) => setFilterData(data)

    const handleApiError = (reason: any) => {
        if(reason instanceof UnauthorizedRequestError)
            showErrorModal('Error', 'You are not authorized', () => logOut(auth))
        else
            switch (reason.status) {
                case 422:
                    reason.json().then((reason: any) =>{
                        const message = `${reason.data?.doctorId !== undefined? reason.data.doctorId + '\n' : ''}${reason.data?.patientId !== undefined? reason.data.patientId + '\n' : ''}${reason.data?.disease !== undefined? reason.data.disease + '\n' : ''}`
                        showErrorModal('Error', message,);
                    })
                    break;
                default:
                    showErrorModal('Error', 'Unknown error', );
            }
        setVaccinations([])
        setLoading(false)
    }
    const loadVaccinations = () => {
        API.getVaccinations(auth, filterData.doctorId, filterData.patientId, page, filterData.disease).then((pair) => {
            setVaccinations(pair.data);
            setPageNumber(pair.pagination.totalPages);
            setLoading(false);
        }).catch(handleApiError);
    }
    useEffect(() => {
        setLoading(true);
        loadVaccinations();
    }, [page, filterData]);
    const showVaccineInfo = (vaccine: Vaccine) => {
        showInfoModal('Vaccine',
            `Vaccine:
            - Name: ${vaccine.name}
            - Disease: ${vaccine.disease}
        - Required doses: ${vaccine.requiredDoses}`)
    }

    const showPatientInfo = (patient: Patient) => {
        showInfoModal('Patient',
            `Name: ${patient.firstName} ${patient.lastName}
            Email: ${patient.email}
            PESEL: ${patient.pesel}`)
    }

    const showDoctorInfo = (doctor: Doctor) => {
        showInfoModal('Doctor',
            `Name: ${doctor.firstName} ${doctor.lastName}
            Email: ${doctor.email}`)
    }
    const renderVaccinationRow = (vaccination: any) => {
        return(
            <tr>
                <td>{moment(new Date(vaccination.vaccinationSlot.date)).format('HH:mm DD.MM.YYYY')}</td>
                <td>{vaccination.status}</td>
                <td style={{padding: "0px"}}>
                    <button style={{width: "100%", height: "100%", padding: "0px", border: "0px", backgroundColor: "transparent",}}

                            onClick={() => showVaccineInfo(vaccination!.vaccine)}
                            disabled={vaccination?.vaccine === null || vaccination?.vaccine === undefined}>
                    {vaccination?.vaccine === null || vaccination?.vaccine === undefined?
                'Vaccine not chosen' : vaccination.vaccine.disease }
                    </button>
                </td>
                <td style={{padding: "0px"}}>
                    <button style={{width: "100%", height: "100%", padding: "0px", border: "0px", backgroundColor: "transparent",}}
                            onClick={() => showPatientInfo(vaccination!.patient)}
                            disabled={vaccination?.patient === null || vaccination?.patient === undefined}>
                        {vaccination?.patient === null || vaccination?.patient === undefined?
                            'Patient not assigned' : vaccination.patient.firstName + " " + vaccination.patient.lastName}
                    </button>
                </td>
                <td style={{padding: "0px"}}>
                    <button style={{width: '100px', height: "100%", padding: "0px", border: "0px", backgroundColor: "transparent",}}
                             onClick={() => showDoctorInfo(vaccination!.doctor)}
                             disabled={vaccination?.doctor === null || vaccination?.doctor === undefined}>
                    {vaccination?.doctor === null || vaccination?.doctor === undefined?
                        'Doctor not assigned' : vaccination.doctor.firstName + " " + vaccination.doctor.lastName}
                </button>
                </td>
            </tr>
        )
    }

    const modifyPage = (delta: number) => {
        if(page + delta >= 1 && page + delta <= pageNumber)
            setPage(page => page + delta);
        return false;
    }
    const renderVaccinationTable = () => {
        return (
            <Table bordered className='text-center'>
                <thead className='table-dark'>
                <tr>
                    <th colSpan={5}>Vaccinations</th>
                </tr>
                </thead>
                <thead className='table-dark'>
                <tr>
                    <th scope='col'>Date</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Disease</th>
                    <th scope='col'>Patient</th>
                    <th scope='col'>Doctor</th>
                </tr>
                </thead>
                <tbody>
                {vaccinations.map(renderVaccinationRow)}
                </tbody>
            </Table>
        )
    }
    return(
        <Container>
            {renderErrorModal()}
            {renderInfoModal()}
            <Row style={{paddingBottom:"4px",}} >
                <Col className="d-flex justify-content-stretch">
                    <AdminVaccinationForm onSubmit={handleSubmit}/>
                </Col>
                <Col className="d-flex justify-content-start col-auto">
                    <Button variant="dark" onClick={() => navigate("/admin/vaccinations/report")}>
                        Vaccination Report
                    </Button>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center">
                {loading &&
                    <div className='spinner-border text-large'
                         style={{width: '100px', height: '100px'}} id='loadingIndicator'/>}
                {!loading && vaccinations.length !== 0 && <Container>
                    {renderVaccinationTable()}
                    <PaginationMenu
                        currentPage = {page}
                        pageCount = {pageNumber}
                        setPage = {setPage}
                        modifyPage = {modifyPage}
                    />
                </Container>}
            </Row>


        </Container>
    )
}

export default AdminVaccinationsPage;