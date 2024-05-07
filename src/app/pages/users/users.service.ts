import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import {
    UserDateformat,
    UserDateformatsRoot,
    UserLocaleOption,
    UserTimezoneGroup,
    UserTimezonesSelect
} from './users.interface';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    constructor() {
    }

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getLocaleOptions(): Observable<UserLocaleOption[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ localeOptions: UserLocaleOption[] }>(`${proxyPath}/users/getLocaleOptions.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.localeOptions;
            })
        )
    }

    public getDateformats(): Observable<UserDateformatsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            dateformats: UserDateformat[],
            defaultDateFormat: string,
            timezones: UserTimezoneGroup
        }>(`${proxyPath}/users/loadDateformats.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                // We reformat the timezones, so we can use them in a select box

                let timezones: UserTimezonesSelect[] = [];
                for (var timezoneGroup in data.timezones) {
                    for (var timezone in data.timezones[timezoneGroup]) {
                        timezones.push({
                            group: timezoneGroup,
                            value: timezone,
                            name: data.timezones[timezoneGroup][timezone]
                        });
                    }

                }

                let result: UserDateformatsRoot = {
                    dateformats: data.dateformats,
                    defaultDateFormat: data.defaultDateFormat,
                    timezones: timezones
                };
                return result;
            })
        )
    }
}
