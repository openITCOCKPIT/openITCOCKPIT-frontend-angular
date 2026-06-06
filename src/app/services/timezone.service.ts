import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';

export interface TimezoneConfiguration {
    user_timezone: string
    user_time_to_server_offset: number
    user_time_to_browser_offset: number
    browser_timezone: string
    user_offset: number
    server_time_utc: number
    server_time: string
    server_timezone_offset: number
    server_time_iso: string
    server_timezone: string
}

export interface UserTimezoneParams {
    angular: boolean,
    disableGlobalLoader: boolean
}

let cachedTimezoneconfiguration: TimezoneConfiguration | undefined;

@Injectable({
    providedIn: 'root'
})
export class TimezoneService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getTimezoneConfiguration(): Observable<TimezoneConfiguration> {
        //if (cachedTimezoneconfiguration) {
        //    return of(cachedTimezoneconfiguration);
        //}
        const proxyPath = this.proxyPath;
        return this.http.get<{ timezone: TimezoneConfiguration }>(`${proxyPath}/angular/user_timezone.json`, {
            params: {
                angular: true,
                browserTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        }).pipe(
            map(data => {
                cachedTimezoneconfiguration = data.timezone;
                return data.timezone
            })
        );
    }

    public getUserTimezone(params: UserTimezoneParams): Observable<{ timezone: TimezoneConfiguration }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ timezone: TimezoneConfiguration }>(`${proxyPath}/angular/user_timezone.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                cachedTimezoneconfiguration = data.timezone;
                return data;
            })
        )
    }

}

export function getUserDate(): Date {
    let now: Date = getBrowserDate();

    if (!cachedTimezoneconfiguration) {
        // Fallback: return browser date
        return now;
    }

    return new Date(now.getTime() + cachedTimezoneconfiguration.user_time_to_browser_offset * 1000);
}

export function getBrowserDate(): Date {
    return new Date();
}
