import { useAuth } from '../components/AuthComponents';
import 'bootstrap';
import { Container, Table, Button } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import { Doctor } from '../types/users';
import { useEffect, useState } from 'react';
import { useEditDoctorModal } from '../components/useEditDoctorModal';
import { AddDoctorForm, useAddDoctorModal } from '../components/useAddDoctorModal';

function AdminDashboard(): JSX.Element {
    const auth = useAuth();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [showEditModal, renderEditModal] = useEditDoctorModal();
    const [showAddModal, renderAddModal] = useAddDoctorModal();

    useEffect(() => {
        if(doctors.length == 0) {
            setDoctors((doctors) => {
                for(let i = 0; i < 20; i++) {
                    doctors.push({
                        'firstName': `Name${i}`,
                        'lastName': `Lastname${i}`,
                        'email': `email${i}@email.com`,
                        'id': i
                    });
                }
                return [...doctors];
            });
        }
    }, []);

    const removeDoctor = (doctor: Doctor) => {
        setDoctors((doctors) => doctors.filter((x) => x !== doctor));
    }

    const renderRow = (doctor: Doctor) => {
        return (<tr key={`row-${doctor.id}`}>
            <td>{doctor.firstName}</td>
            <td>{doctor.lastName}</td>
            <td>{doctor.email}</td>
            <td>
                <Icons.PencilSquare className='text-primary'
                 style={{cursor: 'pointer'}}
                 onClick={() => showEditModal(doctor, (doctor: Doctor) => {})}/>
                <Icons.Trash3Fill className='text-danger'
                 style={{cursor: 'pointer'}}
                 onClick={() => removeDoctor(doctor)}/>
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
                  onClick={() => showAddModal((data: AddDoctorForm) => {})}/>
            </td>
        </tr>)
    }

    return (<>
        {renderEditModal()}
        {renderAddModal()}
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
            <nav className='d-flex justify-content-center'>
                <ul className='pagination'>
                    <li className='page-item'><a className='page-link'>&laquo;</a></li>
                    <li className='page-item'><a className='page-link'>1</a></li>
                    <li className='page-item'><a className='page-link'>&raquo;</a></li>
                </ul>
            </nav>
        </Container>
    </>);

}

export default AdminDashboard;