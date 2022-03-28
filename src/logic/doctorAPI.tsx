import '../components/types';
import { Visit } from '../components/types';
const BASE_URL = 'http://Sopsaabsbackend-develop.eba-jjsphgrc.us-east-1.elasticbeanstalk.com';
export function getSlots(start: Date | null, end: Date | null, onlyReserved: string , authToken: string | undefined, page: number) {
    let sDate = start == null?'':`&startDate=${encodeURIComponent(start.toDateString())}`;
    let eDate = end == null?'':`&endDate=${encodeURIComponent(end.toDateString())}`;
    let reserved = onlyReserved === '-1'?'':`onlyReserved=${encodeURIComponent(onlyReserved)}&`
    return fetch(`${BASE_URL}/doctor/vaccination-slots?${reserved}page=${page}${sDate}${eDate}`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : authToken === undefined? "": authToken,

            },
        }).then(response => {
        if (response.ok) return response.json()
        throw response;
    })
}
export function deleteVisit(visit: Visit, authToken: string | undefined) {
    return fetch(`${BASE_URL}/doctor/vaccination-slots/${visit.id}`,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : authToken === undefined? "": authToken,

            },
        }).then(response => {
        if (response.ok) return response.json()
        throw response;
    })
}