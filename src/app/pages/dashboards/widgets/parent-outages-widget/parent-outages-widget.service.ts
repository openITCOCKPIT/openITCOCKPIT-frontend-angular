import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { ParentOutagesResponse } from './parent-outages-widget.interface';


@Injectable({
    providedIn: 'root'
})
export class ParentOutagesWidgetService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getParentOutagesWidget(hostname: string): Observable<ParentOutagesResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<ParentOutagesResponse>(`${proxyPath}/dashboards/parentOutagesWidget.json`, {
            params: {
                angular: true,
                'filter[Hosts.name]': hostname
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
