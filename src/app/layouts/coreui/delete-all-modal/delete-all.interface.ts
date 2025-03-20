import { Observable } from 'rxjs';

export interface DeleteAllItem {
    id: number | string,           // ID of the item to delete
    displayName: string   // name of the item that will be displayed in the modal
}

export interface DeleteAllModalService {
    delete(item: DeleteAllItem): Observable<any>;
}

export interface DeleteAllResponse {
    success: boolean
    id?: string | number        // Only on error
    message?: string            // Only on error
    usedBy?: {
        [key: string]: DeleteAllUsedBy
    }  // Only on error
    moduleError?: usedByModuleError,
    _csrfToken: string
}

export interface usedByModuleError {
    module: string,
    message: string,
    angularUrl: ''
}

export interface DeleteAllUsedBy {
    baseUrl: string
    state: string
    message: string
    module: string
    id: string|number
}
