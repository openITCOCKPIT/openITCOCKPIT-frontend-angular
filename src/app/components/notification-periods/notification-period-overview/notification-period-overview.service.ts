import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PROXY_PATH } from '../../../tokens/proxy-path.token';
import {
    HostNotificationPeriodOverviewResponse,
    NotificationObjectType,
    NotificationPeriodApiContact,
    NotificationPeriodApiObject,
    NotificationPeriodOverviewData,
    NotificationPeriodTimeperiod,
    ServiceNotificationPeriodOverviewResponse
} from './notification-period-overview.interfaces';
import { resolveTimeperiod, resolveTimeperiods } from './notification-period-overview.utils';

@Injectable({
    providedIn: 'root'
})
export class NotificationPeriodOverviewService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    /**
     * Loads the notification periods of a host or service and its contacts,
     * normalizes the response of both endpoints to {object, contacts}
     * and resolves the notification periods (incl. recursive excludes).
     */
    public getNotificationsOverview(objectType: NotificationObjectType, id: number): Observable<NotificationPeriodOverviewData> {
        if (objectType === 'service') {
            return this.getServiceNotificationsOverview(id).pipe(
                map((result) => this.resolve(result.service, result.contacts, result.timeperiods))
            );
        }

        return this.getHostNotificationsOverview(id).pipe(
            map((result) => this.resolve(result.host, result.contacts, result.timeperiods))
        );
    }

    private resolve(
        object: NotificationPeriodApiObject,
        contacts: NotificationPeriodApiContact[],
        timeperiods: NotificationPeriodTimeperiod[]
    ): NotificationPeriodOverviewData {
        const resolved = resolveTimeperiods(timeperiods);
        // Unknown ids (e.g. deleted timeperiod) resolve to an empty timeperiod
        const period = (timeperiodId: number) => resolved.get(timeperiodId) ?? resolveTimeperiod(timeperiodId, new Map());

        return {
            object: {...object, notificationPeriod: period(object.notificationPeriodId)},
            contacts: contacts.map((contact) => ({...contact, notificationPeriod: period(contact.notificationPeriodId)}))
        };
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
