import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { ReportMailLogIndexParams, ReportMailLogIndexRoot } from './report-mail-log.interface';

@Injectable({
    providedIn: 'root'
})
export class ReportMailLogService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: ReportMailLogIndexParams): Observable<ReportMailLogIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ReportMailLogIndexRoot>(`${proxyPath}/report_mail_log/index.json`, {
            params: params as {} // cast ReportMailLogIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        );
    }
}
