import {Role} from '../types/users';
import {BASE_URL} from './config';
import {StatusCodes} from 'http-status-codes';
import {UnauthorizedRequestError} from '../types/unauthorizedRequestError';

export async function login(role: Role, email: string,
                            password: string): Promise<any> {
    return await fetch(`${BASE_URL}/${role}/login`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, password: password})
        }).then(response => {
            if (response.ok) return response.json()
            if (response.status === StatusCodes.UNAUTHORIZED) {
                throw new UnauthorizedRequestError('Invalid credentials');
            }
            throw response;
        });
}