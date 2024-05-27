import { Observable } from 'rxjs';

export interface DisableItem {
    id: number,           // ID of the item to delete
    displayName: string   // name of the item that will be displayed in the modal
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
