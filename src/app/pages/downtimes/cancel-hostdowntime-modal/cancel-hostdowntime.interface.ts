import { Observable } from 'rxjs';
import { DeleteAllUsedBy } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';

export interface CancelAllItem {
    id: number,           // ID of the item to delete
    displayName: string   // name of the item that will be displayed in the modal
}

export interface CancelHostdowntimeModalService {
    delete(item: CancelHostdowntimeModalService): Observable<any>;
}
export interface CancelAllResponse {
    success: boolean
    id?: string | number        // Only on error
    message?: string            // Only on error
    _csrfToken: string
}
