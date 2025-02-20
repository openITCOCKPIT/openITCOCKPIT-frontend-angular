import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { DOCUMENT } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

import {
    AutoreportsIndexRoot,
    AutoreportsIndexParams,
    CalendarParams,
    AutoreportPost,
    AutoreportObject,
    HostServiceParams,
    AutoreportPostObject,
    AtutoreportEditPost
} from './autoreports.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { InstantreportGenerateResponse } from '../../../../pages/instantreports/instantreports.interface';


@Injectable({
    providedIn: 'root'
})
export class AutoreportsService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getAutoreportsIndex(params: AutoreportsIndexParams): Observable<AutoreportsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<AutoreportsIndexRoot>(`${proxyPath}/autoreport_module/autoreports/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getAutreportsGenerateIndex():Observable<AutoreportsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<AutoreportsIndexRoot>(`${proxyPath}/autoreport_module/autoreports/generate.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )

    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/autoreport_module/autoreports/delete/${item.id}.json?angular=true`, {});
    }

    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/containers/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers;
            })
        )
    }

    public loadCalendars(params:CalendarParams): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ calendars: SelectKeyValue[] }>(`${proxyPath}/calendars/loadCalendarsByContainerId.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data.calendars;
            })
        )
    }

    public setAddStepOne(post: AutoreportPost): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/autoreport_module/autoreports/addStepOne.json?angular=true`,
            post
        ).pipe(
            map((data: any) => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data
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

    public setAddStepTwo(id: number, post: any): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/autoreport_module/autoreports/addStepTwo/${id}.json?angular=true`,
            post
        ).pipe(
            map((data: any) => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data
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

    public getAddStepTwo(id: number): Observable<AutoreportObject> {
        const proxyPath = this.proxyPath;
        return this.http.get<{autoreport: AutoreportObject}>(`${proxyPath}/autoreport_module/autoreports/addStepTwo/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.autoreport;
            })
        )
    }

    public getEditStepOne(id: number): Observable<AutoreportPostObject> {
        const proxyPath = this.proxyPath;
        return this.http.get<{autoreport: AutoreportPostObject}>(`${proxyPath}/autoreport_module/autoreports/editStepOne/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.autoreport;
            })
        )
    }

    public setEditStepOne(id: number, post: any): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/autoreport_module/autoreports/editStepOne/${id}.json?angular=true`,
            post
        ).pipe(
            map((data: any) => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data
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

    public getEditStepTwo(id: number): Observable<AtutoreportEditPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<AtutoreportEditPost>(`${proxyPath}/autoreport_module/autoreports/editStepTwo/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
    public setEditStepTwo(id: number, post: any): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/autoreport_module/autoreports/editStepTwo/${id}.json?angular=true`,
            post
        ).pipe(
            map((data: any) => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data
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

    public getEditStepThree(id: number): Observable<AutoreportObject> {
        const proxyPath = this.proxyPath;
        return this.http.get<{autoreport: AutoreportObject}>(`${proxyPath}/autoreport_module/autoreports/editStepThree/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.autoreport;
            })
        )
    }

    public loadHosts (containerId: number, search: string, selected: number[]): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            hosts: SelectKeyValue[]
        }>(`${proxyPath}/hosts/loadHostsByContainerId.json`, {
            params: {
                'angular': true,
                'containerId': containerId,
                'filter[Hosts.name]': search,
                'selected[]': selected,
                'resolveContainerIds': true

            }
        }).pipe(
            map(data => {
                return data.hosts
            })
        )
    }

    public loadServicesWithHostByHostIds(params: HostServiceParams): Observable<any>{
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/autoreport_module/autoreports/hostAndServicesByHostId.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data
            })
        );
    }

    public generateHtmlReport(post: any):Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/autoreport_module/autoreports/generate.json`, post)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data
                    };
                }),
                catchError((error: any) => {
                    const err = error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })

            );
    }

}
