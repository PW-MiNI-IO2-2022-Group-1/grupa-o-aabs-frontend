import { Visit } from '../types/vaccination';
import { BASE_URL } from './config';
import moment from "moment";

export function getSlots(start: Date | null, end: Date | null, onlyReserved: string , authToken: string | null, page: number) {
    if(start != null) start.setHours(0,0,0,0);
    if(end != null) end.setHours(23,59,59,999);
    let sDate = start == null?'':`&startDate=${encodeURIComponent(moment(start).format("YYYY-MM-DDThh:mm:ssZ"))}`;
    let eDate = end == null?'':`&endDate=${encodeURIComponent(moment(end).format("YYYY-MM-DDThh:mm:ssZ"))}`;
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
export function setScheduleDate(slot: Date, authToken: string | null) {
    return fetch(`${BASE_URL}/doctor/vaccination-slots`,
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken === null ? '': authToken
        },
        body: JSON.stringify({'date' : moment(slot).format("YYYY-MM-DDThh:mm:ssZ")}),
    }).then(response => {
            if(response.ok) return response.json();
            throw response;
        });
}