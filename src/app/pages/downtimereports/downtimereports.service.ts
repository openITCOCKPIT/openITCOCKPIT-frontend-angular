import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { DowntimeReportsRequest, DowntimeReportsResponse } from './downtimereports.interface';

@Injectable({
    providedIn: 'root'
})
export class DowntimereportsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: DowntimeReportsRequest): Observable<DowntimeReportsResponse> {
        // format params.from_date and params.to_date from the "yyyy-mm-dd" date to "dd.mm.yyyy" date.
        // OGODWHY...
        params.from_date = params.from_date.split('-').reverse().join('.');
        params.to_date = params.to_date.split('-').reverse().join('.');

        return this.http.post<DowntimeReportsResponse>(`${this.proxyPath}/downtimereports/index.json`, params).pipe(
            map((data: DowntimeReportsResponse): DowntimeReportsResponse => {
                return data;
            })
        );
    }

}