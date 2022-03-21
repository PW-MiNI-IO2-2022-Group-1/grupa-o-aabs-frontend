import React from 'react';
import './App.css';
import LoginPage from "./pages/LoginPage";

import {
    Routes,
    Route,
    // Link,
    // useNavigate,
    useLocation,
    Navigate,
    Outlet,
} from "react-router-dom";
import DoctorDashboard from "./pages/DoctorDashboard";
import {loginDoctor} from "./logic/api";

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/" element={<p>Landing page</p>}/>
                    <Route path="/loginDoctor" element={<header className="App-header"><LoginPage/></header>}/>
                    <Route path="/loginPatient" element={<header className="App-header"><LoginPage/></header>}/>
                    <Route path="/loginAdmin" element={<header className="App-header"><LoginPage/></header>}/>
                    <Route
                        path="/doctor"
                        element={
                            <RequireAuth authLocation={"/loginDoctor"}>
                                <DoctorDashboard/>
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/patient"
                        element={
                            <RequireAuth authLocation={"/loginPatient"}>
                                <DoctorDashboard/>
                                {/*todo - cos innego niz doctor dsashbord*/}
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <RequireAuth authLocation={"/loginAdmin"}>
                                <DoctorDashboard/>
                                {/*todo - cos innego niz doctor dsashbord*/}
                            </RequireAuth>
                        }
                    />
                    {/*<Route*/}
                    {/*    path="/doctor/setSchedule"*/}
                    {/*    element={<header className="App-header"><EnterSchedulePage/></header>}*/}
                    {/*/>*/}
                </Route>
            </Routes>
        </AuthProvider>
    );
}

function Layout() {
    return (
        <>
            <Outlet/>
        </>
    );
}

interface AuthContextType {
    token?: string;
    signin: (email: string, password: string) => void;
    signout: () => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({children}: { children: React.ReactNode }) {
    const [token, setToken] = React.useState(undefined);

    const signin = (email: string, password: string) => {
        loginDoctor(email, password)
            .then((response) => {
                setToken(response.token)
            })
            .catch((reason) => {
                console.log(reason)
            })
    };

    const signout = () => {
        setToken(undefined)
    };

    const value = {token, signin, signout};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return React.useContext(AuthContext);
}

function RequireAuth({children, authLocation}: { children: JSX.Element, authLocation: string }) {
    let auth = useAuth();
    let location = useLocation();

    if (!auth.token) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to={authLocation} state={{from: location}} replace/>;
    }

    return children;
}
