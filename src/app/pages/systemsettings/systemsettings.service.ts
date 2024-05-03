import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { SystemsettingsCategories } from './systemsettings.interface';
import { GenericResponse } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class SystemsettingsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(): Observable<SystemsettingsCategories> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            all_systemsettings: SystemsettingsCategories
        }>(`${proxyPath}/systemsettings/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.all_systemsettings;
            })
        );
    }

    public updateSystemsettings(systemsettings: SystemsettingsCategories): Observable<GenericResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/systemsettings/index.json?angular=true`, systemsettings)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: true
                    };
                }),
                catchError((error: any) => {
                    return of({
                        success: false,
                        data: error.error
                    });
                })
            );
    }
}
