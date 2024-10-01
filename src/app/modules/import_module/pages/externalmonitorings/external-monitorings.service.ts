import { inject, Injectable } from '@angular/core';

import { PermissionsService } from '../../../../permissions/permissions.service';
import { ExternalMonitoringsIndexParams, ExternalMonitoringsIndexRoot } from './external-monitorings.interface';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { ModalService } from '@coreui/angular';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class ExternalMonitoringsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    private readonly PermissionsService = inject(PermissionsService);
    private readonly modalService = inject(ModalService);

    constructor() {
    }

    public getIndex(params: ExternalMonitoringsIndexParams): Observable<ExternalMonitoringsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ExternalMonitoringsIndexRoot>(`${proxyPath}/import_module/external_monitorings/index.json`, {
            params: params as {} // cast ExternalMonitoringsIndexParams into object
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
        return this.http.post(`${proxyPath}/import_module/external_monitorings/delete/${item.id}.json?angular=true`, {});
    }
}
