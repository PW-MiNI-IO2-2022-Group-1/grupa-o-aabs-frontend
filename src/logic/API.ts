import { StatusCodes } from "http-status-codes";
import { AuthState } from "../types/auth";
import { UnauthorizedRequestError } from "../types/requestErrors";

export function apiCall(url: string, method: string, auth?: AuthState,
                            body?: string): Promise<any> {
    let headers: HeadersInit = auth === undefined ? {
        'Content-Type': 'application/json'
    } : {
        'Content-Type': 'application/json',
        'Authorization': auth?.token ?? ''
    };
    return fetch(url,
        {
            method: method,
            headers: headers,
            body: body
        });
}

export function apiGet(url: string, auth?: AuthState, body?: string) {
    return apiCall(url, 'GET', auth, body);
}

export function apiPost(url: string, auth?: AuthState, body?: string) {
    return apiCall(url, 'POST', auth, body);
}

export function apiPut(url: string, auth?: AuthState, body?: string) {
    return apiCall(url, 'PUT', auth, body);
}

export function apiDelete(url: string, auth?: AuthState, body?: string) {
    return apiCall(url, 'DELETE', auth, body);
}

export function checkStatusAndGetBody(response: Response): Promise<any> {
    if(response.ok) return response.json();
    if(response.status === StatusCodes.UNAUTHORIZED)
        throw new UnauthorizedRequestError('You are not authorized');
    throw response;
}

export function checkStatusAndIgnoreBody(response: Response): void {
    if(response.ok) return;
    if(response.status === StatusCodes.UNAUTHORIZED)
        throw new UnauthorizedRequestError('You are not authorized');
    throw response;
}