import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { CustomAlertsIndex, CustomAlertsIndexParams, LoadContainersRoot } from './customalerts.interface';

@Injectable({
    providedIn: 'root'
})
export class CustomAlertsService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: CustomAlertsIndexParams): Observable<CustomAlertsIndex> {
        return this.http.get<CustomAlertsIndex>(`${this.proxyPath}/customalert_module/customalerts/index.json`, {
            params: {
                ...params
            }
        }).pipe(
            map((data: CustomAlertsIndex): CustomAlertsIndex => {
                return data;
            })
        );
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        return this.http.get<LoadContainersRoot>(`${this.proxyPath}/customalert_module/customalerts/loadContainers.json?angular=true`);
    }
}