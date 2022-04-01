
// const BASE_URL = 'http://localhost:8080';
const BASE_URL = 'http://Sopsaabsbackend-develop.eba-jjsphgrc.us-east-1.elasticbeanstalk.com';

function login(who: string) {
    return async (email: string, password: string) => {
        return fetch(`${BASE_URL}/${who}/login`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email, password: password})
            }).then(response => {
            if (response.ok) return response.json()
            throw response;
        })
    }
}

export const loginDoctor = login('doctor')
export const loginPatient = login('patient')
export const loginAdmin = login('admin')
