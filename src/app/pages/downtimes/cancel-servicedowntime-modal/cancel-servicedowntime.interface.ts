import { Observable } from 'rxjs';

export interface CancelAllItem {
    id: number           // ID of the item to delete
}

export interface CancelServicedowntimeModalService {
    delete(item: CancelServicedowntimeModalService): Observable<any>;
}

export interface CancelAllResponse {
    success: boolean
    id?: string | number        // Only on error
    message?: string            // Only on error
    _csrfToken: string
}
