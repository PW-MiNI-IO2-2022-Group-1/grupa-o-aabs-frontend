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
import { EditPatientDetailsPage } from './pages/EditPatientDetailsPage';
import RegisterPatientPage from "./pages/RegisterPatientPage";

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<Layout />}/>
                    <Route path='/' element={<RequireAuth authLocation='/loginPatient'><p>Landing page</p></RequireAuth>} />
                    <Route path='/loginDoctor' element={<header className='App-header'><LoginPage role={Role.Doctor}/></header>} />
                    <Route path='/loginPatient' element={<header className='App-header'><LoginPage role={Role.Patient}/></header>} />
                    <Route path='/loginAdmin' element={<header className='App-header'><LoginPage role={Role.Admin}/></header>} />
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
                                <header className='App-header'>
                                    <EditPatientDetailsPage/>
                                </header>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/doctor/setSchedule'
                        element={<header className='App-header'><EnterSchedulePage /></header>}
                    />
                    <Route
                        path='/admin'
                        element={
                            <RequireAuth role={Role.Admin} authLocation={'/loginAdmin'}>
                                <header className='App-header'>
                                    <DoctorDashboard />
                                </header>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/editPatientDetails'
                        element={
                            <header className='App-header'>
                            <EditPatientDetailsPage/>
                            </header>
                        }
                    />
                    <Route
                        path='/registerPatient'
                        element={<RegisterPatientPage />}
                    />

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