import { inject, Injectable } from '@angular/core';
import { CommandIndexRoot, CommandsIndexParams } from '../commands/commands.interface';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { NotificationIndexParams, NotificationIndexRoot } from './notifications.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

  constructor() { }

    public getIndex(params: NotificationIndexParams): Observable<NotificationIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<NotificationIndexRoot>(`${proxyPath}/notifications/index.json`, {
            params: params as {} // cast CommandsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
