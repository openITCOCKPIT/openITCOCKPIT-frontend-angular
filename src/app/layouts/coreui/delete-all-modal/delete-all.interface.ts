import { Observable } from 'rxjs';

export interface DeleteAllItem {
  id: number,           // ID of the item to delete
  displayName: string   // name of the item that will be displayed in the modal
}

export interface DeleteAllModalService {
  delete(item: DeleteAllItem): Observable<any>;
}
