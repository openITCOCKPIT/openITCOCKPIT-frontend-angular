import { BackgrounduploadsService } from '../../mapeditors/backgrounduploads.service';
import { DeleteAllItem } from '../../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BackgrounduploadsIconsService extends BackgrounduploadsService{
    public override delete(item: DeleteAllItem): Observable<Object> {

        console.log('DELETE HERE !!!');

        return this.http.post(`${this.proxyPath}/map_module/backgroundUploads/deleteIcon.json?angular=true`, {
            'filename': item.id
        });
    }
}
