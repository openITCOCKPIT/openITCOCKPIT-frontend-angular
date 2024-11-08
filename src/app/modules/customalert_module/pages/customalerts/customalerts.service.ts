import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import {
    CheckHoststatusForAcknowledgementsRequest,
    CheckHoststatusForAcknowledgementsResponse,
    CustomAlertHistory,
    CustomAlertsIndex,
    CustomAlertsIndexParams,
    LoadContainersRoot
} from './customalerts.interface';

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

    public annotate(customAlertId: number, comment: string, setAnnotationAsHostAcknowledgement: boolean, setServiceAcknowledgement: boolean): Observable<void> {
        let a: string = '&setAnnotationAsHostAcknowledgement=true&setAnnotationAsServiceAcknowledgement=' + (setServiceAcknowledgement ? 'true' : 'false');
        return this.http.post<void>(`${this.proxyPath}/customalert_module/customalerts/annotate/${customAlertId}.json?angular=true${a}`, {
            comment
        });
    }

    public closeManually(customAlertId: number, comment: string): Observable<void> {
        return this.http.post<void>(`${this.proxyPath}/customalert_module/customalerts/close/${customAlertId}.json?angular=true`, {
            comment
        });
    }

    public loadContainers(): Observable<LoadContainersRoot> {
        return this.http.get<LoadContainersRoot>(`${this.proxyPath}/customalert_module/customalerts/loadContainers.json?angular=true`);
    }

    public getHistory(customAlertId: number) : Observable<CustomAlertHistory> {
        return this.http.get<CustomAlertHistory>(`${this.proxyPath}/customalert_module/customalerts/history/${customAlertId}.json?angular=true`);
    }

    public checkHoststatusForAcknowledgements(params: CheckHoststatusForAcknowledgementsRequest): Observable<CheckHoststatusForAcknowledgementsResponse> {
        return this.http.post<CheckHoststatusForAcknowledgementsResponse>(`${this.proxyPath}/customalert_module/Customalerts/checkHoststatusForAcknowledgements.json?angular=true`, params);
    }
}