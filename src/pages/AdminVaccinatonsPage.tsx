import {Col, Container, Row, Table} from "react-bootstrap";
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
import {VaccinationFilterData} from "../types/adminAPITypes";



function AdminVaccinatonsPage() {
    const auth = useAuth();
    const [showErrorModal, renderErrorModal] = useSimpleModal();
    const [showInfoModal, renderInfoModal] = useSimpleModal();
    const [vaccinations, setVaccinations] = useState<Object[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [filterData, setFilterData] = useState<VaccinationFilterData>({
        doctorId: 21,
        patientId: null,
        disease: null,
    });

    const onSubmit = (data: VaccinationFilterData) => {
        setFilterData(data);
    }

    const handleApiError = (reason: any) => {
        if(reason instanceof UnauthorizedRequestError)
            showErrorModal('Error', 'You are not authorized', () => logOut(auth))
        else
            switch (reason.status) {
                case 422:
                    showErrorModal('Error', reason.data);
                    break;
                default:
                    showErrorModal('Error', 'Unknown error');
            }

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
            <Row>
                <Col>{moment(new Date(vaccination.vaccinationSlot.date)).format('HH:mm DD.MM.YYYY')}</Col>
                <Col>
                    <button style={{width: "100%", border: "0px",}}
                            onClick={() => showVaccineInfo(vaccination!.vaccine)}
                            disabled={vaccination?.vaccine === null || vaccination?.vaccine === undefined}>
                    {vaccination?.vaccine === null || vaccination?.vaccine === undefined?
                'Vaccine not chosen' : vaccination.vaccine.disease }
                    </button>
                </Col>
                <Col>
                    <button style={{width: "100%", border: "0px",}}
                            onClick={() => showPatientInfo(vaccination!.patient)}
                            disabled={vaccination?.patient === null || vaccination?.patient === undefined}>
                        {vaccination?.patient === null || vaccination?.patient === undefined?
                            'Patient not assigned' : vaccination.patient.firstName + " " + vaccination.patient.lastName}
                    </button>
                </Col>
                <Col>
                    <button style={{width: "100%", border: "0px",}}
                             onClick={() => showDoctorInfo(vaccination!.doctor)}
                             disabled={vaccination?.doctor === null || vaccination?.doctor === undefined}>
                    {vaccination?.doctor === null || vaccination?.doctor === undefined?
                        'Doctor not assigned' : vaccination.doctor.firstName + " " + vaccination.doctor.lastName}
                </button>
                </Col>
            </Row>
        )
    }

    const modifyPage = (delta: number) => {
        if(page + delta >= 1 && page + delta <= pageNumber)
            setPage(page => page + delta);
        return false;
    }

    return(
        <Container>
            {renderErrorModal()}
            {renderInfoModal()}
            {loading &&
                <div className='spinner-border text-large'
                style={{width: '100px', height: '100px'}} id='loadingIndicator'/>}
            {!loading && <Container>
                <Row>
                    {vaccinations.map(renderVaccinationRow)}
                </Row>
                <PaginationMenu
                    currentPage = {page}
                    pageCount = {pageNumber}
                    setPage = {setPage}
                    modifyPage = {modifyPage}
                />
            </Container>}
        </Container>
    )
}

export default AdminVaccinatonsPage;