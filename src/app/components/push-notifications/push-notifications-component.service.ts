import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import { map, Observable } from 'rxjs';
import { PushConfigurationRoot } from './push-notifications.interface';

@Injectable({
    providedIn: 'root'
})
export class PushNotificationsComponentService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getPushConfiguration(): Observable<PushConfigurationRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<PushConfigurationRoot>(`${proxyPath}/angular/push_configuration.json`, {
            params: {
                'angular': true,
                'includeUser': true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
