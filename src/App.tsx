import './App.css';
import LoginPage from './pages/LoginPage';
import SetSchedulePage from './pages/SetSchedulePage'
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
import ReportBugPage from './pages/ReportBugPage';

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
                                <SetSchedulePage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/admin'
                        element={
                            <RequireAuth role={Role.Admin} authLocation={'/loginAdmin'}>
                                <AdminDashboard/>
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
                        path='patient/register'
                        element={<RegisterPatientPage/>}
                    />

                    <Route
                        path='/patient/vaccineRegistration'
                        element={<RequireAuth role={Role.Patient} authLocation={'/loginPatient'}>
                            <VaccineRegistrationPage/>
                        </RequireAuth>}
                    />
                    
                    <Route 
                      path='bugs' 
                      element={<RequireAuth role={null} authLocation={'/'}>
                          <ReportBugPage/>
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