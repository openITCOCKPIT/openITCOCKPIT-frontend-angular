import { inject, Injectable } from '@angular/core';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';

@Injectable({
    providedIn: 'root'
})
export class HostsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }


    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/hosts/delete/${item.id}.json`, {});
    }
}
