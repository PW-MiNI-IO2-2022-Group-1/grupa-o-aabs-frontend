import {Visit} from '../types/vaccination';
import {BASE_URL} from './config';
import moment from "moment";
import { checkStatusAndGetBody, checkStatusAndIgnoreBody, apiGet, apiDelete, apiPost } from './API';
import { AuthState } from '../types/auth';

export function getSlots(start: Date | null, end: Date | null, onlyReserved: string, auth: AuthState, page: number) {
    if (start != null) start.setHours(0, 0, 0, 0);
    if (end != null) end.setHours(23, 59, 59, 999);

    let sDate = start == null ? '' : `&startDate=${encodeURIComponent(start.toISOString())}`;
    let eDate = end == null ? '' : `&endDate=${encodeURIComponent(end.toISOString())}`;
    let reserved = onlyReserved === '-1' ? '' : `onlyReserved=${encodeURIComponent(onlyReserved)}&`

    return apiGet(`${BASE_URL}/doctor/vaccination-slots?${reserved}page=${page}${sDate}${eDate}`,
                   auth)
            .then(checkStatusAndGetBody);
}

export function deleteVisit(visit: Visit, auth: AuthState) {
    return apiDelete(`${BASE_URL}/doctor/vaccination-slots/${visit.id}`, auth)
        .then(checkStatusAndIgnoreBody);
}

export function setScheduleDate(slot: Date, auth: AuthState) {
    return apiPost(`${BASE_URL}/doctor/vaccination-slots`, auth,
           JSON.stringify({'date': moment(slot).toISOString()}))
        .then(checkStatusAndIgnoreBody);
}