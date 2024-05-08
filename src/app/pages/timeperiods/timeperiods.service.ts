import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { Container, TimeperiodIndexRoot, TimeperiodPost, TimeperiodsIndexParams } from './timeperiods.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class TimeperiodsService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: TimeperiodsIndexParams): Observable<TimeperiodIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<TimeperiodIndexRoot>(`${proxyPath}/timeperiods/index.json`, {
            params: params as {} // cast TimeperiodsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getAdd(): Observable<Container[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            containers: Container[]
        }>(`${proxyPath}/containers/loadContainersForAngular.json?angular=true`).pipe(
            map(data => {
                return data['containers'];
            })
        )
    }

    public getCalendars(searchString: string, containerId: number): Observable<any[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            calendars: any[]
        }>(`${proxyPath}/calendars/loadCalendarsByContainerId.json?angular=true`, {
            params: {
                containerId: containerId,
                'filter[Calendar.name]': searchString
            }
        }).pipe(
            map(data => {
                return data['calendars'];
            })
        )
    }

    public createTimeperiod(command: TimeperiodPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/timeperiods/add.json?angular=true`, {
            Command: command
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
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
