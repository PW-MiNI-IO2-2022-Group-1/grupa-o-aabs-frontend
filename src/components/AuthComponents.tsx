import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { login } from '../logic/login';
import { AuthContextType, AuthState } from '../types/auth';
import { User, Role } from '../types/users';

const AuthContext = React.createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const saveAuth = () => {
        if(authState.token != null
          && authState.user != null
          && authState.role != null) {
            localStorage.setItem('token', authState.token);
            localStorage.setItem('role', authState.role);
            localStorage.setItem('user', JSON.stringify(authState.user));
        }
    };

    const loadAuth: () => AuthState = () => {
        const loadedToken: string | null = localStorage.getItem('token');
        const loadedRole: Role | null = localStorage.getItem('role') as (Role | null);

        const userJson = localStorage.getItem('user');
        let loadedUser: User | null = null;
        if(userJson != null)
            loadedUser = JSON.parse(userJson) as (User | null);

        const authState: AuthState = { token: null, user: null, role: null };
        if(loadedToken != null && loadedRole != null && loadedUser != null) {
            authState.token = loadedToken;
            authState.role = loadedRole;
            authState.user = loadedUser;
        }
        return authState;
    };

    const clearAuth: () => void = () => {
        localStorage.clear();
    };

    const [authState, setAuthState] = React.useState<AuthState>(loadAuth());

    const signIn = async (role: Role, email: string, password: string): Promise<void> => {
        await login(role, email, password).then((json: any) => {
            setAuthState((state) => {
                state.token = json.token;
                state.role = role;
                if(role === Role.Admin)
                    state.user = json.admin;
                else if(role === Role.Doctor)
                    state.user = json.doctor;
                else if(role === Role.Patient)
                    state.user = json.patient;
                return {...state};
            });
        });
    };

    useEffect(() => {
       saveAuth(); 
    }, [authState]);


    const signOut = () => {
        setAuthState((state) => {
            state.token = null;
            state.user = null;
            state.role = null;
            return {...state};
        });
        clearAuth();
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
    const location = useLocation();

    if (auth.token === null || auth.role !== role) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to={authLocation} state={{ from: location }} replace />;
    }

    return children;
}