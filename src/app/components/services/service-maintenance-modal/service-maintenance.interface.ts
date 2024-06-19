import { Observable } from 'rxjs';

export interface MaintenanceItem {
    command: string,
    hostUuid: string,
    serviceUuid: string,
    start: number,
    end: number,
    author: string,
    comment: string,
}


export interface MaintenanceModal {
    setExternalCommands(item: MaintenanceItem): Observable<any>,
}

export interface ValidationResponse {
    success: boolean,
    data: Object
}

export interface ValidationErrors {
   comment?: string[],
    from_date?: string[],
    from_time?: string[],
    to_date?: string[],
    to_time?: string[]
}

export interface Response {
    success: boolean
    id?: string | number        // Only on error
    message?: string            // Only on error
   // usedBy?: DisableUsedBy[]  // Only on error
    _csrfToken: string
}

