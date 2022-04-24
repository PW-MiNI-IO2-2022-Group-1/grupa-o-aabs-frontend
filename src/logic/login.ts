import { Role } from '../types/users';
import { BASE_URL } from './config';
import { StatusCodes } from 'http-status-codes';
import { UnauthorizedRequestError, UnexpectedRequestError } from '../types/requestErrors';
import { AuthContextType } from '../types/auth';

export async function logIn(auth: AuthContextType, role: Role, email: string, 
                            password: string): Promise<any> {
    return await fetch(`${BASE_URL}/${role}/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, password: password})
        }).then(response => {
            if (response.ok) {
                return response.json()
            }
            else if(response.status === StatusCodes.UNAUTHORIZED)
                throw new UnauthorizedRequestError('Invalid credentials');
            else
                throw new UnexpectedRequestError('Unexpected error');
        }).then((json) => {
            auth.modifyState((state) => {
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
}

export async function logOut(auth: AuthContextType): Promise<any> {
    auth.modifyState((state) => {
        state.token = null;
        state.user = null;
        state.role = null;
        return {...state};
    });
}