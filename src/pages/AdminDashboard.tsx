import Button from 'react-bootstrap';
import React from 'react';
import { useAuth } from '../components/AuthComponents';

function AdminDashboard(): JSX.Element {
    const auth = useAuth();

    return (<>
        <h1>Hi {auth.user?.email}</h1>
        <h1>Congratulations! You are administrator :D</h1>
        </>);

}

export default AdminDashboard;