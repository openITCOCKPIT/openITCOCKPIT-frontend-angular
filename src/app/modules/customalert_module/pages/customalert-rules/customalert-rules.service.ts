import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { CustomAlertRulesIndex, CustomAlertRulesIndexParams } from './customalert-rules.interface';

@Injectable({
    providedIn: 'root'
})
export class CustomalertRulesService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: CustomAlertRulesIndexParams): Observable<CustomAlertRulesIndex> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<CustomAlertRulesIndex>(`${proxyPath}/customalert_module/customalert_rules/index.json`, {
            params: {
                ...params
            }
        }).pipe(
            map((data: CustomAlertRulesIndex): CustomAlertRulesIndex => {
                return data;
            })
        );
    }
}