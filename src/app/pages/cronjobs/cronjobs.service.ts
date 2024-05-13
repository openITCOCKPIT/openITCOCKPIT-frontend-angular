import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { Cronjob, CronjobPost, CronjobsIndex } from './cronjob.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class CronjobsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(): Observable<CronjobsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<CronjobsIndex>(`${proxyPath}/cronjobs/index.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getPlugins(include: string): Observable<string[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ plugins: string[] }>(`${proxyPath}/cronjobs/getPlugins.json`, {
            params: {
                angular: true,
                include: include
            }
        }).pipe(
            map(data => {
                return data.plugins
            })
        )
    }

    public getTasks(pluginName: string = 'Core', include: string): Observable<string[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ coreTasks: { [key: string]: string } }>(`${proxyPath}/cronjobs/getTasks.json`, {
            params: {
                angular: true,
                pluginName: pluginName,
                include: include
            }
        }).pipe(
            map(data => {
                let tasks: string[] = [];
                for (var i in data.coreTasks) {
                    tasks.push(data.coreTasks[i]);
                }
                return tasks
            })
        )
    }

    public createConjob(cronjob: CronjobPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<{ cronjob: Cronjob }>(`${proxyPath}/cronjobs/add.json?angular=true`, {
            Cronjob: cronjob
        }).pipe(
            map(data => {
                // Return true on 200 Ok
                const resultData: GenericIdResponse = {
                    id: Number(cronjob.id)
                };

                return {
                    success: true,
                    data: resultData
                };

            }),
            catchError((error: any) => {
                const err = error.error.error as GenericValidationError;
                return of({
                    success: false,
                    data: err
                });
            })
        )
    }

}
