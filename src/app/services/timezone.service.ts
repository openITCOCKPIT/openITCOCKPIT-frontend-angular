import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../tokens/proxy-path.token';
import { map, Observable, of } from 'rxjs';

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
        if (cachedTimezoneconfiguration) {
            return of(cachedTimezoneconfiguration);
        }
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

/**
 * Vanilla JavaScript Date object with user timezone offset applied.
 * Otherwise, the Date object will always construct with UTC timezone.
 */
export function getUserDate(): Date {
    let now: Date = new Date();

    if (!cachedTimezoneconfiguration) {
        // You shall not pass!
        return now;
    }

    return new Date(now.getTime() + cachedTimezoneconfiguration.user_time_to_browser_offset * 1000);
}
