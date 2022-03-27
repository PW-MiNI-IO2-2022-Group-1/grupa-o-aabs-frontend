import { userInfo } from "os";
import React from "react";
import {
    Routes,
    Route,
    useLocation,
    Navigate,
    Outlet,
} from "react-router-dom";
import { Role, User, Admin, Doctor, Patient } from "./models/Users";
import { login } from "./logic/api";
import { waitFor } from "@testing-library/dom";
import { setSourceMapRange } from "typescript";

interface AuthContextType {
    user: User | null; 
    token: string | null;
    role: Role | null;

    signIn: (role: Role, email: string, password: string) => void;
    signOut: () => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

class AuthState {
    token: string | null = null;
    user: User | null = null;
    role: Role | null = null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = React.useState<AuthState>(new AuthState());

    const signIn = (role: Role, email: string, password: string) => {
        login(role, email, password).then((json: any) => {
            setAuthState((state) => {
                state.token = json.token;
                state.role = role;
                if(role == Role.Admin)
                    state.user = json.admin;
                else if(role == Role.Doctor)
                    state.user = json.doctor;
                else if(role == Role.Patient)
                    state.user = json.patient;
                return state;
            });
        });
    };

    const signOut = () => {
        setAuthState((state) => {
            state.token = null;
            state.user = null;
            state.role = null;
            return state;
        });
    }

    const value: AuthContextType = { user: authState.user, token: authState.token, 
                                     role: authState.role, signIn, signOut };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    return React.useContext(AuthContext);
}

export function RequireAuth({ children, authLocation, role}
        : { children: JSX.Element, authLocation: string, role?: Role | null}) {
    let auth: AuthContextType = useAuth();
    let location = useLocation();

    if (!auth.token || auth.role != role) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to={authLocation} state={{ from: location }} replace />;
    }

    return children;
}