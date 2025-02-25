import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { ResourcegroupsIndex, ResourcegroupsIndexParams } from './resourcegroups.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class ResourcegroupsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getResourcegroups(params: ResourcegroupsIndexParams): Observable<ResourcegroupsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<ResourcegroupsIndex>(`${proxyPath}/scm_module/resourcegroups/index.json`, {
            params: params as {} // cast ResourcegroupsIndexParams into object
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
        return this.http.post(`${proxyPath}/scm_module/resourcegroups/delete/${item.id}.json?angular=true`, {});
    }
}
