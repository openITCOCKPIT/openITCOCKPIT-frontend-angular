import { Observable } from 'rxjs';

export interface MaintenanceItem {
    command: string,
    hostUuid: string,
    serviceUuid: string,
    start: string,
    end: string
    author: string,
    comment: string,
}

export interface maintenanceModalService {
    setExternalCommands(item: MaintenanceItem): Observable<any>;
}

export interface maintenanceResponse {
    success: boolean
    id?: string | number        // Only on error
    message?: string            // Only on error
    usedBy?: MaintenanceUsedBy[]  // Only on error
    _csrfToken: string
}

export interface MaintenanceUsedBy {
    baseUrl: string
    state: string
    message: string
    module: string
}

export interface DisableResponse {
    success: boolean
    id?: string | number        // Only on error
    message?: string            // Only on error
   // usedBy?: DisableUsedBy[]  // Only on error
    _csrfToken: string
}

