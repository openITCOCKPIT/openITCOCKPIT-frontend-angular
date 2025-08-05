import { inject, Injectable, DOCUMENT } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    NotificationIndexParams,
    NotificationIndexRoot,
    NotificationServicesParams,
    NotificationServicesRoot
} from './notifications.interface';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: NotificationIndexParams): Observable<NotificationIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<NotificationIndexRoot>(`${proxyPath}/notifications/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getServices(params: NotificationServicesParams): Observable<NotificationServicesRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<NotificationServicesRoot>(`${proxyPath}/notifications/services.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getHostNotifications(id: number, params: NotificationIndexParams): Observable<NotificationIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<NotificationIndexRoot>(`${proxyPath}/notifications/hostNotification/${id}.json?angular=true`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getServiceNotifications(id: number, params: NotificationServicesParams): Observable<NotificationServicesRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<NotificationServicesRoot>(`${proxyPath}/notifications/serviceNotification/${id}.json?angular=true`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
