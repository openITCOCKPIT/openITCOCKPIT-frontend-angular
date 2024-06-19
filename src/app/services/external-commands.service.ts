import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../tokens/proxy-path.token';
import {catchError, map, Observable} from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class ExternalCommandsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public setExternalCommands(params: any[]): Observable<any> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/nagios_module/cmd/submit_bulk_naemon.json`,
            params)
            .pipe(map(result => {
                    return result
                }),
                catchError((error: any) => {
                    return 'error';
                })
            )
    }

}
