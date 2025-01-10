import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { CheckBackupFinishedResponse, StartBackupResponse } from './backups.interface';

@Injectable({
    providedIn: 'root'
})
export class BackupsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    /**********************
     *    Index action    *
     **********************/
    public createBackup(filename: string): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/backups/backup.json`, {
            filename: filename
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as StartBackupResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }

    public checkBackupFinished(): Observable<CheckBackupFinishedResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<CheckBackupFinishedResponse>(`${proxyPath}/backups/checkBackupFinished.json`).pipe(
            map(data => {
                return data;
            })
        );
    }

}
