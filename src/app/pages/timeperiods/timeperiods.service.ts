import { inject, Injectable, DOCUMENT } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    Timeperiod,
    TimeperiodCopyGet,
    TimeperiodCopyPost,
    TimeperiodIndexRoot,
    TimeperiodsEditRoot,
    TimeperiodsIndexParams,
    TimeperiodUsedBy,
    ViewDetailsTimeperiod,
    ViewDetailsTimeperiodRoot
} from './timeperiods.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

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

    public getAdd(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            containers: SelectKeyValue[]
        }>(`${proxyPath}/containers/loadContainersForAngular.json?angular=true`).pipe(
            map(data => {
                return data['containers'];
            })
        )
    }

    public getEdit(id: number): Observable<TimeperiodsEditRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<TimeperiodsEditRoot>(`${proxyPath}/timeperiods/edit/${id}.json?angular=true`, {}).pipe(
            map(data => {

                // The server response the "day" as integer, but the Frontend expects a string
                let result: TimeperiodsEditRoot = data;
                result.timeperiod.timeperiod_timeranges.forEach((timerange) => {
                    const day = timerange.day;
                    timerange.day = day.toString() as '1' | '2' | '3' | '4' | '5' | '6' | '7';
                });

                return result;
            })
        )
    }

    public getContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            containers: SelectKeyValue[]
        }>(`${proxyPath}/containers/loadContainersForAngular.json?angular=true`).pipe(
            map(data => {
                return data['containers'];
            })
        )
    }

    public getCalendars(searchString: string, containerId: number | null): Observable<any[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            calendars: any[]
        }>(`${proxyPath}/calendars/loadCalendarsByContainerId.json?angular=true`, {
            params: {
                containerId: containerId ? containerId : '',
                'filter[Calendar.name]': searchString
            }
        }).pipe(
            map(data => {
                return data['calendars'];
            })
        )
    }

    public createTimeperiod(timeperiod: Timeperiod): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/timeperiods/add.json?angular=true`, {
            Timeperiod: timeperiod
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

    public updateTimeperiod(timeperiod: Timeperiod): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/timeperiods/edit/${timeperiod.id}.json?angular=true`, {
            Timeperiod: timeperiod
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

    public getTimeperiodsCopy(ids: number[]): Observable<TimeperiodCopyGet[]> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<{
                timeperiods: TimeperiodCopyGet[]
            }>(`${proxyPath}/timeperiods/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map(data => {
                    return data.timeperiods;
                })
            )
    }


    public saveTimeperiodsCopy(timeperiods: TimeperiodCopyPost[]): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/timeperiods/copy/.json?angular=true`, {
            data: timeperiods
        });
    }

    public usedBy(id: number): Observable<TimeperiodUsedBy> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<TimeperiodUsedBy>(`${proxyPath}/timeperiods/usedBy/${id}.json?angular=true`)
            .pipe(
                map(data => {
                    return data;
                })
            )
    }

    public getViewDetailsTimeperiod(id: number): Observable<ViewDetailsTimeperiod> {
        const proxyPath = this.proxyPath;
        return this.http.get<ViewDetailsTimeperiodRoot>(`${proxyPath}/timeperiods/viewDetails/${id}.json?angular=true`).pipe(
            map(data => {
                return data.timeperiod;
            })
        );
    }


    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/timeperiods/delete/${item.id}.json?angular=true`, {});
    }

    public loadTimeperiodsByContainerId(container_id: number): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<{
            timeperiods: SelectKeyValue[]
        }>(`${proxyPath}/timeperiods/loadTimeperiodsByContainerId.json`, {
            params: {
                angular: true,
                containerId: container_id.toString()
            }
        }).pipe(
            map(data => {
                return data.timeperiods;
            })
        )
    }

}
