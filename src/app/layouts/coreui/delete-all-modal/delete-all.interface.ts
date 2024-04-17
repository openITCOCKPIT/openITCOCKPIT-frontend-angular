import { Observable } from 'rxjs';

export interface DeleteAllItem {
  id: number,           // ID of the item to delete
  displayName: string   // name of the item that will be displayed in the modal
}

export interface DeleteAllModalService {
  delete(item: DeleteAllItem): Observable<any>;
}

export interface DeleteAllResponse {
  success: boolean
  id?: string | number        // Only on error
  message?: string            // Only on error
  usedBy?: DeleteAllUsedBy[]  // Only on error
  _csrfToken: string
}

export interface DeleteAllUsedBy {
  baseUrl: string
  state: string
  message: string
  module: string
}
