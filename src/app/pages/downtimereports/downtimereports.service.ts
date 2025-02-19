import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { DowntimeReportsRequest, DowntimeReportsResponse } from './downtimereports.interface';
import { formatDate } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DowntimereportsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);


    public generateReport(data: DowntimeReportsRequest): Observable<any> {
        data.from_date = data.from_date.split('-').reverse().join('.');
        data.to_date = data.to_date.split('-').reverse().join('.');
// https://master/downtimereports/createPdfReport.pdf?angular=true&data%5Bevaluation_type%5D=1&data%5Bfrom_date%5D=19.01.2025&data%5Breflection_state%5D=1&data%5Btimeperiod_id%5D=1&data%5Bto_date%5D=18.02.2025
        let a: Record<string, string> = {
            'angular': 'true',
            'data[from_date]': data.from_date,
            'data[to_date]': data.to_date,
            'data[evaluation_type]': data.evaluation_type.toString(),
            'data[reflection_state]': data.reflection_state.toString(),
            'data[timeperiod_id]': data.timeperiod_id.toString()
        };
        return this.http.get<any>(`${this.proxyPath}/downtimereports/index.json`, {
            params: {
                ...a
            }
        }).pipe(
            map((result: any): any => {
                let queryParams: string = new URLSearchParams(a).toString()
                // serialize the given result into HTTP Query parameters.
                window.location.href = `/downtimereports/createPdfReport.pdf?${queryParams}`;
                console.warn(data);
                return data;
            })
        );
    }

    public getIndex(params: DowntimeReportsRequest): Observable<DowntimeReportsResponse> {
        params.from_date = formatDate(new Date(params.from_date), 'dd.MM.y', 'en-US');
        params.to_date = formatDate(new Date(params.to_date), 'dd.MM.y', 'en-US');

        return this.http.post<DowntimeReportsResponse>(`${this.proxyPath}/downtimereports/index.json`, params).pipe(
            map((data: DowntimeReportsResponse): DowntimeReportsResponse => {
                return data;
            })
        );
    }

}