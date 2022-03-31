import { Role } from '../types/users';
import { BASE_URL } from './config';

export async function login(role: Role, email: string, 
                            password: string): Promise<any> {
    return fetch(`${BASE_URL}/${role}/login`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, password: password})
        }).then(response => {
            if (response.ok) return response.json()
            throw response;
        });
}