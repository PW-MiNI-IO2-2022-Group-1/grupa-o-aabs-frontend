import { User, Role } from './users';

export type AuthContextType = {
    user: User | null; 
    token: string | null;
    role: Role | null;

    signIn: (role: Role, email: string, password: string) => void;
    signOut: () => void;
}

export type AuthState = {
    token: string | null;
    user: User | null;
    role: Role | null;
}