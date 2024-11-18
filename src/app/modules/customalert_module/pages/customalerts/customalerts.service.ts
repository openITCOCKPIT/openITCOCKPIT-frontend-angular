import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import {
    CheckHoststatusForAcknowledgementsRequest,
    CheckHoststatusForAcknowledgementsResponse,
    CustomAlertHistory,
    CustomalertServiceHistory,
    CustomAlertsIndex,
    CustomAlertsIndexFilter,
    CustomAlertsIndexParams,
    CustomAlertsState,
    LoadContainersRoot
} from './customalerts.interface';
import { formatDate } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CustomAlertsService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: CustomAlertsIndexParams, filter: CustomAlertsIndexFilter): Observable<CustomAlertsIndex> {
        // Inject data from bookmarkable filter object:
        params['filter[Hosts.container_id][]'] = filter.Hosts.container_id;
        params['filter[Customalerts.message]'] = filter.Customalerts.message;
        params['filter[from]'] = filter.from;
        params['filter[to]'] = filter.to;
        // params['filter[Customalerts.state][]'] = filter.Customalerts.state;

//        let arr : boolean[] = this.params['filter[Customalerts.state][]'] as unknown as boolean[];
        params['filter[Customalerts.state][]'] = [];

        if (filter.Customalerts.state[CustomAlertsState.New]) {
            params['filter[Customalerts.state][]'].push(CustomAlertsState.New);
        }
        if (filter.Customalerts.state[CustomAlertsState.InProgress]) {
            params['filter[Customalerts.state][]'].push(CustomAlertsState.InProgress);
        }
        if (filter.Customalerts.state[CustomAlertsState.Done]) {
            params['filter[Customalerts.state][]'].push(CustomAlertsState.Done);
        }
        if (filter.Customalerts.state[CustomAlertsState.ManuallyClosed]) {
            params['filter[Customalerts.state][]'].push(CustomAlertsState.ManuallyClosed);
        }

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

    public getServiceHistory(serviceId: number): Observable<CustomalertServiceHistory> {
        let now = new Date();
        // From: 30 days ago
        let fromStr: string = formatDate(new Date(now.getTime() - 86400000 * 30), 'yyyy-MM-ddTHH:mm', 'en-US');
        // To: Tomorrow
        let toStr: string = formatDate(new Date(now.getTime()   + 86400000), 'yyyy-MM-ddTHH:mm', 'en-US');
        let params: object = {
            angular: true,
            sort: 'CustomalertStatehistory.state_time',
            page: 1,
            scroll: true,
            direction: 'desc',
            'filter[from]': fromStr,
            'filter[to]': toStr
        }
        return this.http.get<CustomalertServiceHistory>(`${this.proxyPath}/customalert_module/customalerts/service_history/${serviceId}.json`, {
            params: {
                ...params
            }
        });
    }
}