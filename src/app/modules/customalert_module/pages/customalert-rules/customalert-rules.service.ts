import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { CustomAlertRulesIndex, CustomAlertRulesIndexParams } from './customalert-rules.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class CustomalertRulesService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: CustomAlertRulesIndexParams): Observable<CustomAlertRulesIndex> {
        return this.http.get<CustomAlertRulesIndex>(`${this.proxyPath}/customalert_module/customalert_rules/index.json`, {
            params: {
                ...params
            }
        }).pipe(
            map((data: CustomAlertRulesIndex): CustomAlertRulesIndex => {
                return data;
            })
        );
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        return this.http.post(`${this.proxyPath}/customalert_module/customalert_rules/delete/${item.id}.json`, {});
    }
}