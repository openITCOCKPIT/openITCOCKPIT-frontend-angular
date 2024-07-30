import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { PagerdutySettings } from './PagerdutySettings.interface';
import { map, Observable } from 'rxjs';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class PagerdutySettingsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    getPagerdutySettings(): Observable<PagerdutySettings> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<PagerdutySettings>(`${proxyPath}/pagerduty_module/settings/edit.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map((data: PagerdutySettings) => {
                return data;
            })
        );
    }

    setPagerdutySettings(settings: PagerdutySettings): Observable<PagerdutySettings> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<PagerdutySettings>(`${proxyPath}/pagerduty_module/settings/edit.json`, {
            PagerdutySettings: settings
        }).pipe(
            map((data: PagerdutySettings) => {
                return data;
            })
        );
    }

}