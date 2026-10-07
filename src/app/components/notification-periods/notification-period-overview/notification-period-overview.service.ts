import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PROXY_PATH } from '../../../tokens/proxy-path.token';
import {
    HostNotificationPeriodOverviewResponse,
    NotificationObjectType,
    NotificationPeriodOverviewData,
    ServiceNotificationPeriodOverviewResponse
} from './notification-period-overview.interfaces';

@Injectable({
    providedIn: 'root'
})
export class NotificationPeriodOverviewService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    /**
     * Loads the notification periods of a host or service and its contacts
     * and normalizes the response of both endpoints to {object, contacts}.
     */
    public getNotificationsOverview(objectType: NotificationObjectType, id: number): Observable<NotificationPeriodOverviewData> {
        if (objectType === 'service') {
            return this.getServiceNotificationsOverview(id).pipe(
                map((result) => ({object: result.service, contacts: result.contacts}))
            );
        }

        return this.getHostNotificationsOverview(id).pipe(
            map((result) => ({object: result.host, contacts: result.contacts}))
        );
    }

    private getHostNotificationsOverview(id: number): Observable<HostNotificationPeriodOverviewResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostNotificationPeriodOverviewResponse>(`${proxyPath}/hosts/notificationsOverview/${id}.json`, {
            params: {
                angular: true
            }
        });
    }

    private getServiceNotificationsOverview(id: number): Observable<ServiceNotificationPeriodOverviewResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceNotificationPeriodOverviewResponse>(`${proxyPath}/services/notificationsOverview/${id}.json`, {
            params: {
                angular: true
            }
        });
    }
}
