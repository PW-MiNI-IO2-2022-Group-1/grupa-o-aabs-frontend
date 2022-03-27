import {Role} from '../models/Users';

const BASE_URL = 'http://localhost:8080';
//const BASE_URL = 'http://Sopsaabsbackend-develop.eba-jjsphgrc.us-east-1.elasticbeanstalk.com';

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