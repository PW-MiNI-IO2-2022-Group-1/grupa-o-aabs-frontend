import { useAuth } from '../components/AuthComponents';
import 'bootstrap';
import { Container, Table, Button } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import { Doctor } from '../types/users';
import { useEffect, useState } from 'react';
import { useEditDoctorModal } from '../components/useEditDoctorModal';
import { AddDoctorForm, useAddDoctorModal } from '../components/useAddDoctorModal';
import { useSimpleModal } from '../components/useSimpleModal';
import { NewDoctorData } from '../types/adminAPITypes';
import * as API from '../logic/adminAPI';

function AdminDashboard(): JSX.Element {
    const auth = useAuth();
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    const [page, setPage] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const [showErrorModal, renderErrorModal] = useSimpleModal();
    const [showEditModal, renderEditModal] = useEditDoctorModal();
    const [showAddModal, renderAddModal] = useAddDoctorModal();

    const loadDoctors = () => {
        API.getDoctors(auth, page).then(pair => {
            setDoctors(pair[0]);
            setPageNumber(pair[1].totalPages);
        }).catch(reason => {
            console.log(reason);
            showErrorModal('Error', 'Unexpected error');
        });
    }

    const deleteDoctor = (doctor: Doctor) => {
        API.deleteDoctor(auth, doctor).catch(reason => {
            console.log(reason);
            showErrorModal('Error', 'Unexpected error');
        }).then(() => loadDoctors());
    }

    const editDoctor = (doctor: Doctor) => {
        API.editDoctor(auth, doctor).catch((reason) => {
            console.log(reason);
            showErrorModal('Error', 'Unexpected error');
        }).then(() => loadDoctors());
    }

    const createDoctor = (doctorData: NewDoctorData) => {
        API.createDoctor(auth, doctorData).catch((reason) => {
            console.log(reason);
            showErrorModal('Error', 'Unexpected error');
        }).then(() => loadDoctors());
    }

    useEffect(() => {
        loadDoctors();
    }, [page]);

    const renderRow = (doctor: Doctor) => {
        return (<tr key={`row-${doctor.id}`}>
            <td>{doctor.firstName}</td>
            <td>{doctor.lastName}</td>
            <td>{doctor.email}</td>
            <td>
                <Icons.PencilSquare className='text-primary'
                 style={{cursor: 'pointer'}}
                 onClick={() => showEditModal(doctor, editDoctor)}/>
                <Icons.Trash3Fill className='text-danger'
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

    const renderPaginationMenu = () => {
        const visiblePages: number[] = [];
        const minPage = Math.max(1, page - 3);
        const maxPage = Math.min(pageNumber, page + 3);
        for(let i = minPage; i <= maxPage; i++)
            visiblePages.push(i);
        return (<nav className='d-flex justify-content-center'>
            <ul className='pagination'>
                <li className='page-item'><a className='page-link' onClick={() => modifyPage(-1)}>&laquo;</a></li>
                {visiblePages.map(x => {
                    return (<li className={'page-item' + (page == x ? ' active' : '')}>
                        <a className='page-link'
                            onClick={() => {
                                setPage(x);
                                return false;
                            }}
                        >{x}</a>
                    </li>);
                })}
                <li className='page-item'><a className='page-link' onClick={() => modifyPage(1)}>&raquo;</a></li>
            </ul>
        </nav>);
    }

    return (<>
        {renderEditModal()}
        {renderAddModal()}
        {renderErrorModal()}
        <Container>
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
                    {doctors.map(renderRow)}
                    {renderAddNewDoctorRow()}
                </tbody>
            </Table>
            {renderPaginationMenu()}
        </Container>
    </>);

}

export default AdminDashboard;