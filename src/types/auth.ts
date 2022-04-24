import { User, Role } from './users';

export type AuthContextType = {
    user: User | null; 
    token: string | null;
    role: Role | null;

    modifyState: (modifyFunc: React.SetStateAction<AuthState>) => void;
}

export type AuthState = {
    token: string | null;
    user: User | null;
    role: Role | null;
}