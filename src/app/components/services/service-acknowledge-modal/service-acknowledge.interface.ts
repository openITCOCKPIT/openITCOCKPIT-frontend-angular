import { Observable } from 'rxjs';


export interface AcknowledgeItem {
    command: string,
    hostUuid: string,
    serviceUuid: string,
    sticky: number,
    notify: boolean,
    author: string,
    comment: string,
}

export interface AcknowledgeModal {
    setExternalCommands(item: AcknowledgeItem): Observable<any>,
}

export interface Response {
    success: boolean
    id?: string | number        // Only on error
    message?: string            // Only on error
   // usedBy?: DisableUsedBy[]  // Only on error
    _csrfToken: string
}

