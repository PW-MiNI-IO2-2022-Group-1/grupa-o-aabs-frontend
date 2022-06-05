import { useAuth } from '../components/AuthComponents';
import 'bootstrap';
import { Container, Table, Row, Col, Button } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import { Doctor } from '../types/users';
import { useEffect, useState } from 'react';
import { useEditDoctorModal } from '../components/modals//useEditDoctorModal';
import { useAddDoctorModal } from '../components/modals/useAddDoctorModal';
import { useSimpleModal } from '../components/modals/useSimpleModal';
import { NewDoctorData } from '../types/adminAPITypes';
import * as API from '../logic/adminAPI';
import { UnauthorizedRequestError } from '../types/requestErrors';
import { logOut } from '../logic/login';
import {useNavigate} from "react-router-dom";
import PaginationMenu from '../components/PaginationMenu';

function AdminDashboard(): JSX.Element {
    const auth = useAuth();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [page, setPage] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const [showErrorModal, renderErrorModal] = useSimpleModal();
    const [showEditModal, renderEditModal] = useEditDoctorModal();
    const [showAddModal, renderAddModal] = useAddDoctorModal();

    const handleApiError = (reason: any) => {
        if(reason instanceof UnauthorizedRequestError)
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

    const deleteDoctor = (doctor: Doctor) => {
        setLoading(true);
        API.deleteDoctor(auth, doctor).catch(handleApiError)
           .then(() => loadDoctors());
    }

    const editDoctor = (doctor: Doctor) => {
        setLoading(true);
        API.editDoctor(auth, doctor).catch(handleApiError)
           .then(() => loadDoctors());
    }

    const createDoctor = (doctorData: NewDoctorData) => {
        setLoading(true);
        API.createDoctor(auth, doctorData).catch(handleApiError)
           .then(() => loadDoctors());
    }

    useEffect(() => {
        setLoading(true);
        loadDoctors();
    }, [page]);

    const renderDoctorRow = (doctor: Doctor) => {
        return (<tr id={`row-${doctor.id}`} key={`row-${doctor.id}`}>
            <td style={{width: '350px'}}>{doctor.firstName}</td>
            <td style={{width: '350px'}}>{doctor.lastName}</td>
            <td style={{width: '350px'}}>{doctor.email}</td>
            <td style={{width: '100px'}}>
                <Icons.PencilSquare className='text-primary modifyBtn'
                 style={{cursor: 'pointer'}}
                 onClick={() => showEditModal(doctor, editDoctor)}/>
                <Icons.Trash3Fill className='text-danger deleteBtn'
                 id={'delete' + doctor.id + 'Btn'}
                 style={{cursor: 'pointer'}}
                 onClick={() => deleteDoctor(doctor)}/>
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
                  id = 'addNewDoctorBtn'
                  style={{cursor: 'pointer'}}
                  onClick={() => showAddModal(createDoctor)}/>
            </td>
        </tr>)
    }

    const modifyPage = (delta: number) => {
        if(page + delta >= 1 && page + delta <= pageNumber)
            setPage(page => page + delta);
        return false;
    }

    return (<>
        {renderEditModal()}
        {renderAddModal()}
        {renderErrorModal()}
        <Container>
            <Row style={{paddingBottom:"2px",}}>
                <Col className="d-flex justify-content-end">
                    <Button variant="dark" onClick={() => navigate("/admin/report/vaccinations")}>
                        Vaccination Report
                    </Button>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center">{loading &&
                <div className='spinner-border text-large'
                     style={{width: '100px', height: '100px'}} id='loadingIndicator'/>}
            {!loading && <Container>
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
                <PaginationMenu
                    currentPage = {page}
                    pageCount = {pageNumber}
                    setPage = {setPage}
                    modifyPage = {modifyPage}
                />
            </Container>}
        </Row>
        </Container>
    </>);

}

export default AdminDashboard;