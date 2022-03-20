
const BASE_URL = 'http://localhost:8080';
// const BASE_URL = '';

export const loginDoctor = async (email: string, password: string) => {
    return fetch(`${BASE_URL}/doctor/login`,
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