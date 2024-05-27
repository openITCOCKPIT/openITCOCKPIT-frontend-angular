import { Observable } from 'rxjs';

export interface DisableItem {
    id: number,
    displayName: string
}

export interface DisableModalService {
    disable(item: DisableItem): Observable<any>;
}

export interface DisableResponse {
    success: boolean
    id?: string | number        // Only on error
    message?: string            // Only on error
    usedBy?: DisableUsedBy[]  // Only on error
    _csrfToken: string
}

export interface DisableUsedBy {
    baseUrl: string
    state: string
    message: string
    module: string
}
