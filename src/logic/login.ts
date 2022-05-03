import { Role } from '../types/users';
import { BASE_URL } from './config';
import { AuthContextType } from '../types/auth';
import { apiPost, checkStatusAndGetBody } from './API';

export async function logIn(auth: AuthContextType, role: Role, email: string, 
                            password: string): Promise<any> {
    return await apiPost(`${BASE_URL}/${role}/login`, undefined,
            JSON.stringify({email: email, password: password}))
        .then(checkStatusAndGetBody)
        .then((json) => {
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