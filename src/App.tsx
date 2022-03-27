import React from 'react';
import './App.css';
import LoginPage from "./pages/LoginPage";
import EnterSchedulePage from "./pages/EnterSchedulePage"
import {
    Routes,
    Route,
    useLocation,
    Navigate,
    Outlet,
} from "react-router-dom";
import DoctorDashboard from "./pages/DoctorDashboard";
import { login } from "./logic/api";
import {AuthProvider, useAuth, RequireAuth } from './Auth';
import {Role} from './models/Users';

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<RequireAuth authLocation="/loginPatient"><p>Landing page</p></RequireAuth>} />
                    <Route path="/loginDoctor" element={<header className="App-header"><LoginPage role={Role.Doctor}/></header>} />
                    <Route path="/loginPatient" element={<header className="App-header"><LoginPage role={Role.Patient}/></header>} />
                    <Route path="/loginAdmin" element={<header className="App-header"><LoginPage role={Role.Admin}/></header>} />
                    <Route
                        path="/doctor"
                        element={
                            // <RequireAuth authLocation={"/loginDoctor"}>
                            <DoctorDashboard />
                            // </RequireAuth>
                        }
                    />
                    <Route
                        path="/patient"
                        element={
                            <RequireAuth authLocation={"/loginPatient"}>
                                <DoctorDashboard />
                                {/*todo - cos innego niz doctor dsashbord*/}
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/doctor/setSchedule"
                        element={<header className="App-header"><EnterSchedulePage /></header>}
                    />
                    <Route
                        path="/admin"
                        element={
                            <RequireAuth role={Role.Doctor} authLocation={"/loginAdmin"}>
                                <DoctorDashboard />
                                {/*todo - cos innego niz doctor dsashbord*/}
                            </RequireAuth>
                        }
                    />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

function Layout() {
    return (
        <>
            <Outlet />
        </>
    );
}
