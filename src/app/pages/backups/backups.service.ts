import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import {
    BackupIndexResponse,
    CheckBackupFinishedResponse,
    StartBackupResponse,
    StartRestoreBackupResponse
} from './backups.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

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
        return this.http.get<CheckBackupFinishedResponse>(`${proxyPath}/backups/checkBackupFinished.json`, {
            params: {
                disableGlobalLoader: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    /**********************
     *   Restore action   *
     **********************/
    public getAvailableBackups(): Observable<BackupIndexResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<BackupIndexResponse>(`${proxyPath}/backups/index.json`).pipe(
            map(data => {
                return data;
            })
        );
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/backups/deleteBackupFile.json`, {
            filename: item.id
        });
    }

    public restoreBackup(filenameWithPath: string): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        return this.http.post<any>(`${proxyPath}/backups/restore.json`, {
            backupfile: filenameWithPath
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as StartRestoreBackupResponse
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

}
