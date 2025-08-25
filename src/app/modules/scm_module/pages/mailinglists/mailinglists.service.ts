import { inject, Injectable } from '@angular/core';
import { ResourcegroupsIndex, ResourcegroupsIndexParams } from '../resourcegroups/resourcegroups.interface';
import { map, Observable } from 'rxjs';
import { MailinglistsIndex, MailinglistsIndexParams } from './mailinglists.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
  providedIn: 'root'
})
export class MailinglistsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);
    public getMailinglists(params: MailinglistsIndexParams): Observable<MailinglistsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<MailinglistsIndex>(`${proxyPath}/scm_module/mailinglists/index.json`, {
            params: params as {} // cast MailinglistsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    /**********************
     *    Delete action    *
     **********************/
    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/scm_module/mailinglists/delete/${item.id}.json?angular=true`, {});
    }

}
