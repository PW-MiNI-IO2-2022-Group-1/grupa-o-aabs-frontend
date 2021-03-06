import {useAuth} from '../components/AuthComponents';
import 'bootstrap';
import { Container, Table, Row, Col, Button } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import {Doctor, Patient} from '../types/users';
import {useEffect, useState} from 'react';
import {useEditDoctorModal} from '../components/modals/useEditDoctorModal';
import {useAddDoctorModal} from '../components/modals/useAddDoctorModal';
import {useSimpleModal} from '../components/modals/useSimpleModal';
import {NewDoctorData} from '../types/adminAPITypes';
import * as API from '../logic/adminAPI';
import { UnauthorizedRequestError } from '../types/requestErrors';
import { logOut } from '../logic/login';
import {useNavigate} from "react-router-dom";
import PaginationMenu from '../components/PaginationMenu';
import {useEditPatientModal} from "../components/modals/useEditPatientModal";

function AdminDashboard(): JSX.Element {
    const auth = useAuth();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [patientsOrDoctors, setPatientsOrDoctors] = useState<'patients' | 'doctors'>('doctors')

    const [page, setPage] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const [showErrorModal, renderErrorModal] = useSimpleModal();
    const [showEditDoctorModal, renderEditDoctorModal] = useEditDoctorModal();
    const [showEditPatientModal, renderEditPatientModal] = useEditPatientModal();
    const [showAddModal, renderAddModal] = useAddDoctorModal();

    const handleApiError = (reason: any) => {
        if (reason instanceof UnauthorizedRequestError)
            showErrorModal('Error', 'You are not authorized', () => logOut(auth))
        else
            showErrorModal('Error', 'Unexpected error');
    }

    const loadDoctors = () => {
        API.getDoctors(auth, page).then(pair => {
            setDoctors(pair[0]);
            setPageNumber(pair[1].totalPages);
            setLoading(false);
        }).catch(handleApiError);
    }

    const loadPatients = () => {
        API.getPatients(auth, page).then(pair => {
            setPatients(pair[0]);
            setPageNumber(pair[1].totalPages);
            setLoading(false);
        }).catch(handleApiError);
    }

    const deleteDoctor = (doctor: Doctor) => {
        setLoading(true);
        API.deleteDoctor(auth, doctor).catch(handleApiError)
            .then(() => loadDoctors());
    }

    const deletePatient = (patient: Patient) => {
        setLoading(true);
        API.deletePatient(auth, patient).catch(handleApiError)
            .then(() => loadDoctors());
    }

    const editDoctor = (doctor: Doctor) => {
        setLoading(true);
        API.editDoctor(auth, doctor).catch(handleApiError)
            .then(() => loadDoctors());
    }

    const editPatient = (patient: Patient) => {
        setLoading(true);
        API.editPatient(auth, patient).catch(handleApiError)
            .then(() => loadPatients());
    }

    const createDoctor = (doctorData: NewDoctorData) => {
        setLoading(true);
        API.createDoctor(auth, doctorData).catch(handleApiError)
            .then(() => loadDoctors());
    }

    useEffect(() => {
        setLoading(true);
        if (patientsOrDoctors === 'doctors') {
            loadDoctors();
        } else {
            loadPatients();
        }
    }, [page, patientsOrDoctors]);

    const renderDoctorRow = (doctor: Doctor) => {
        return (<tr id={`row-${doctor.id}`} key={`row-${doctor.id}`}>
            <td style={{width: '350px'}}>{doctor.firstName}</td>
            <td style={{width: '350px'}}>{doctor.lastName}</td>
            <td style={{width: '350px'}}>{doctor.email}</td>
            <td style={{width: '100px'}}>
                <Icons.PencilSquare className='text-primary modifyBtn'
                                    style={{cursor: 'pointer'}}
                                    onClick={() => showEditDoctorModal(doctor, editDoctor)}/>
                <Icons.Trash3Fill className='text-danger deleteBtn'
                                  id={'delete' + doctor.id + 'Btn'}
                                  style={{cursor: 'pointer'}}
                                  onClick={() => deleteDoctor(doctor)}/>
            </td>
        </tr>);
    }

    const renderPatientRow = (patient: Patient) => {
        return (<tr id={`row-${patient.id}`} key={`row-${patient.id}`}>
            <td style={{width: '350px'}}>{patient.firstName}</td>
            <td style={{width: '350px'}}>{patient.lastName}</td>
            <td style={{width: '350px'}}>{patient.email}</td>
            <td style={{width: '350px'}}>{patient.pesel}</td>
            <td style={{width: '350px'}}>{patient.address.city}</td>
            <td style={{width: '300px'}}>{patient.address.zipCode}</td>
            <td style={{width: '350px'}}>{patient.address.street}</td>
            <td style={{width: '300px'}}>{patient.address.houseNumber}</td>
            <td style={{width: '300px'}}>{patient.address.localNumber}</td>
            <td style={{width: '100px'}}>
                <Icons.PencilSquare className='text-primary modifyBtn'
                                    style={{cursor: 'pointer'}}
                                    onClick={() => showEditPatientModal(patient, editPatient)}/>
                <Icons.Trash3Fill className='text-danger deleteBtn'
                                  id={'delete' + patient.id + 'Btn'}
                                  style={{cursor: 'pointer'}}
                                  onClick={() => deletePatient(patient)}/>
            </td>
        </tr>);
    }

    const renderAddNewDoctorRow = () => {
        return (<tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <Icons.PersonPlusFill className='text-primary'
                                      id='addNewDoctorBtn'
                                      style={{cursor: 'pointer'}}
                                      onClick={() => showAddModal(createDoctor)}/>
            </td>
        </tr>)
    }

    const modifyPage = (delta: number) => {
        if (page + delta >= 1 && page + delta <= pageNumber)
            setPage(page => page + delta);
        return false;
    }

    const renderPaginationMenu = () => {
        const visiblePages: number[] = [];
        const minPage = Math.max(1, page - 3);
        const maxPage = Math.min(pageNumber, page + 3);
        for (let i = minPage; i <= maxPage; i++)
            visiblePages.push(i);
        return (<nav className='d-flex justify-content-center'>
            <ul className='pagination'>
                <li className='page-item' style={{cursor: 'pointer'}}>
                    <a className='page-link'
                       onClick={() => modifyPage(-1)}>&laquo;</a>
                </li>
                {visiblePages.map(x => {
                    return (<li style={{cursor: 'pointer'}} className={'page-item' + (page == x ? ' active' : '')}>
                        <a className='page-link'
                           onClick={() => {
                               setPage(x);
                               return false;
                           }}
                        >{x}</a>
                    </li>);
                })}
                <li style={{cursor: 'pointer'}} className='page-item'>
                    <a className='page-link' onClick={() => modifyPage(1)}>&raquo;</a>
                </li>
            </ul>
        </nav>);
    }

    const changeToDoctorsOrPatients = () => {
        setPage(1)
        if (patientsOrDoctors === 'doctors') {
            setPatientsOrDoctors('patients')
        } else {
            setPatientsOrDoctors('doctors')
        }
    }

    const renderDoctorTable = () => {
        return (
            <Table bordered className='text-center'>
                <thead className='table-dark'>
                <tr>
                    <th colSpan={4}>Doctors</th>
                </tr>
                </thead>
                <thead className='table-dark'>
                <tr>
                    <th scope='col'>First name</th>
                    <th scope='col'>Last name</th>
                    <th scope='col'>Email</th>
                    <th scope='col'>Actions</th>
                </tr>
                </thead>
                <tbody>
                {doctors.map(renderDoctorRow)}
                {renderAddNewDoctorRow()}
                </tbody>
            </Table>
        )
    }

    const renderPatientTable = () => {
        return (
            <Table bordered className='text-center'>
                <thead className='table-dark'>
                <tr>
                    <th colSpan={10}>Patients</th>
                </tr>
                </thead>
                <thead className='table-dark'>
                <tr>
                    <th scope='col'>First name</th>
                    <th scope='col'>Last name</th>
                    <th scope='col'>Email</th>
                    <th scope='col'>PESEL</th>
                    <th scope='col'>City</th>
                    <th scope='col'>Zip Code</th>
                    <th scope='col'>Street</th>
                    <th scope='col'>House number</th>
                    <th scope='col'>Local number</th>
                    <th scope='col'>Actions</th>
                </tr>
                </thead>
                <tbody>
                {patients.map(renderPatientRow)}
                </tbody>
            </Table>
        )
    }

    return (<>
        {renderEditDoctorModal()}
        {renderEditPatientModal()}
        {renderAddModal()}
        {renderErrorModal()}
        <Container>
            <Row className="d-flex justify-content-center">
                {loading &&
                    <div className='spinner-border text-large'
                         style={{width: '100px', height: '100px'}} id='loadingIndicator'></div>}
                {!loading && <Container style={{fontSize: '20px'}}>
                    <Row className="d-flex justify-content-center">
                        <Col className="d-flex justify-content-start">
                            <Button onClick={changeToDoctorsOrPatients}>
                                {'Show ' + (patientsOrDoctors === 'doctors' ? 'patients' : 'doctors')}
                            </Button>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Button variant="dark" onClick={() => navigate("/admin/vaccinations")}>
                                Vaccinations
                            </Button>
                        </Col>
                    </Row>

                    {patientsOrDoctors === 'doctors' ? renderDoctorTable() : renderPatientTable()}
                    {renderPaginationMenu()}
                </Container>}
        </Row>
        </Container>
    </>);

}

export default AdminDashboard;