import { Visit } from '../types/vaccination';
import { BASE_URL } from './config';

export function getSlots(start: Date | null, end: Date | null, onlyReserved: string , authToken: string | null, page: number) {
    let sDate = start == null?'':`&startDate=${encodeURIComponent(start.toDateString())}`;
    let eDate = end == null?'':`&endDate=${encodeURIComponent(end.toDateString())}`;
    let reserved = onlyReserved === '-1'?'':`onlyReserved=${encodeURIComponent(onlyReserved)}&`
    return fetch(`${BASE_URL}/doctor/vaccination-slots?${reserved}page=${page}${sDate}${eDate}`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : authToken === null ? "" : authToken,

            },
        }).then(response => {
        if (response.ok) return response.json()
        throw response;
    })
}

export function deleteVisit(visit: Visit, authToken: string | null) {
    return fetch(`${BASE_URL}/doctor/vaccination-slots/${visit.id}`,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : authToken === null ? "": authToken,

            },
        }).then(response => {
        if (response.ok) return response.json()
        throw response;
    })
}