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

export function apiGetPdf(url: string, auth?: AuthState, name?: string,) {

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/pdf',
            'Authorization': auth?.token ?? ''
        }
    }).then((response) => {
        if (response.ok) {
            return response.blob();
        }
        if (response.status === StatusCodes.UNAUTHORIZED)
            throw new UnauthorizedRequestError('You are not authorized');
        throw response;
    }).then((b)=> showFile(b, name ?? 'file.pdf'))
}

function showFile(blob: BlobPart, name: string){
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    const newBlob = new Blob([blob], {type: "application/pdf"});

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement('a');
    link.href = data;
    link.download=name;
    link.click();
    setTimeout(function(){
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
    }, 100);
}