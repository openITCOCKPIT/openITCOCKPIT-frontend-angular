import { inject, Injectable, DOCUMENT } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';

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
    AutoreportEditPost,
    AutoreportDownloadParams,
    AutoreportServiceUsedByResponse,
    AutoreportHostUsedByResponse,
    GenerateResponse
} from './autoreports.interface';
import {
    GenericResponse,
    GenericResponseWrapper,
    GenericValidationError
} from '../../../../generic-responses';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';



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

    public getEditStepTwo(id: number): Observable<AutoreportEditPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<AutoreportEditPost>(`${proxyPath}/autoreport_module/autoreports/editStepTwo/${id}.json`, {
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

    public generateReport(post: any):Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/autoreport_module/autoreports/generate.json`, post)
        .pipe(
            map(data => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data as GenericResponse
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

    public generateReportPdf(params: AutoreportDownloadParams): Observable<Blob> {
        const proxyPath = this.proxyPath;
        return this.http.get<Blob>(`${proxyPath}/autoreport_module/autoreports/generate.pdf`, params as {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public generateReportZip(params: AutoreportDownloadParams): Observable<Blob> {
        const proxyPath = this.proxyPath;
        return this.http.get<Blob>(`${proxyPath}/autoreport_module/autoreports/generate.zip`, params as {}).pipe(
            map(data => {
                return data;
            })
        )
    }

    public serviceUsedByAutoreport(id:number): Observable<AutoreportServiceUsedByResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<AutoreportServiceUsedByResponse>(`${proxyPath}/autoreport_module/autoreports/serviceUsedBy/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public hostUsedByAutoreport(id:number): Observable<AutoreportHostUsedByResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<AutoreportHostUsedByResponse>(`${proxyPath}/autoreport_module/autoreports/hostUsedBy/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
