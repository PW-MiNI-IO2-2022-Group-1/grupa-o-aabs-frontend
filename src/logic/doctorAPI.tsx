import '../components/types';
import { Visit } from '../components/types';
const BASE_URL = 'http://Sopsaabsbackend-develop.eba-jjsphgrc.us-east-1.elasticbeanstalk.com';
export function getSlots(start: Date | null, end: Date | null, onlyReserved: string , authToken: string | null, page: number) {
    let sDate = start == null?'':`&date[gte]=${encodeURIComponent(start.toDateString())}`;
    let eDate = end == null?'':`&date[lte]=${encodeURIComponent(end.toDateString())}`;
    let reserved = onlyReserved === '-1'?'':`onlyReserved=${encodeURIComponent(onlyReserved)}&`
    return fetch(`${BASE_URL}/doctor/vaccination-slots?${reserved}page=${page}${sDate}${eDate}`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : authToken === null? "": authToken,

            },
        }).then(response => {
        if (response.ok) return response.json()
        throw response;
    })
}
export function deleteVisit(visit: Visit, authToken: string) {
    return fetch(`${BASE_URL}/doctor/vaccination-slots/${visit.id}`,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : authToken,

            },
        }).then(response => {
        if (response.ok) return response.json()
        throw response;
    })
}