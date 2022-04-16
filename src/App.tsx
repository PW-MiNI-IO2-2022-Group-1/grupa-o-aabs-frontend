import './App.css';
import LoginPage from './pages/LoginPage';
import EnterSchedulePage from './pages/EnterSchedulePage'
import {
    Routes,
    Route,
    Outlet,
} from 'react-router-dom';
import DoctorDashboard from './pages/DoctorDashboard';
import {AuthProvider, RequireAuth } from './components/AuthComponents';
import {Role} from './types/users';
import EditPatientDetailsPage from './pages/EditPatientDetailsPage';
import AdminDashboard from './pages/AdminDashboard';
import FrontAuthPage from './pages/FrontPage';
import PageHeader from './components/PageHeader';
import RegisterPatientPage from "./pages/RegisterPatientPage";
import VaccineRegistrationPage from './pages/VaccineRegistrationPage';
import { PatientFrontPage } from './pages/PatientFrontPage';

export default function App() {
    return (
        <AuthProvider>
            <PageHeader>
            <Routes>
                <Route element={<Layout />}/>
                    <Route path='/' element={<FrontAuthPage/>} />
                    <Route path='/loginDoctor' element={<LoginPage role={Role.Doctor}/>}/>
                    <Route path='/loginPatient' element={<LoginPage role={Role.Patient}/>}/>
                    <Route path='/loginAdmin' element={<LoginPage role={Role.Admin}/>} />
                    <Route
                        path='/doctor'
                        element={
                            <RequireAuth role={Role.Doctor} authLocation={'/loginDoctor'}>
                                <DoctorDashboard />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/patient'
                        element={
                            <RequireAuth role={Role.Patient} authLocation={'/loginPatient'}>
                                    <PatientFrontPage/>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/doctor/setSchedule'
                        element={
                            <RequireAuth role={Role.Doctor} authLocation={'/loginDoctor'}>
                                <EnterSchedulePage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/admin'
                        element={
                            <RequireAuth role={Role.Admin} authLocation={'/loginAdmin'}>
                                    <AdminDashboard></AdminDashboard>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/patient/editDetails'
                        element={
                            <RequireAuth role={Role.Patient} authLocation={'/loginPatient'}>
                                <EditPatientDetailsPage/>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/registerPatient'
                        element={<RegisterPatientPage/>}
                    />

                    <Route
                        path='/patient/vaccineRegistration'
                        element={<RequireAuth role={Role.Patient} authLocation={'/loginPatient'}>
                            <VaccineRegistrationPage/>
                        </RequireAuth>}
                    />

            </Routes>
            </PageHeader>
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