import React from 'react';
import { Button } from 'react-bootstrap';
import {
    /*Routes,
    Route,
    Link, */
    useNavigate,
    /*useLocation,
    Navigate,
    Outlet,*/
} from "react-router-dom";
function DoctorDashboard() {
    const navigate = useNavigate()
    return (
        <div>
            <>Doctor dashboard</>
            <Button onClick={() => navigate('/doctor/setSchedule')}>Set schedule</Button>
        </div>

    )
}

export default DoctorDashboard;
