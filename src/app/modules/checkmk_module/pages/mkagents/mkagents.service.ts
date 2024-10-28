import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { MkagentPost, MkagentsDownloadRoot, MkagentsIndexParams, MkagentsIndexRoot } from './mkagents.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class MkagentsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: MkagentsIndexParams): Observable<MkagentsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MkagentsIndexRoot>(`${proxyPath}/checkmk_module/mkagents/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/checkmk_module/mkagents/delete/${item.id}.json?angular=true`, {});
    }

    public getDownload(): Observable<MkagentsDownloadRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MkagentsDownloadRoot>(`${proxyPath}/checkmk_module/mkagents/download.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }


    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;
        return this.http.get<{
            containers: SelectKeyValue[]
        }>(`${proxyPath}/checkmk_module/mkagents/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers
            })
        );
    }

    public add(mkagent: MkagentPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/checkmk_module/mkagents/add.json?angular=true`, {
            Mkagent: mkagent
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.mkagent as GenericIdResponse
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

    public getMkagentEdit(id: number): Observable<MkagentPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ mkagent: MkagentPost }>(`${proxyPath}/checkmk_module/mkagents/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.mkagent;
            })
        );
    }

    public saveMkagentEdit(mkagent: MkagentPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/checkmk_module/mkagents/edit/${mkagent.id}.json?angular=true`, {
            Mkagent: mkagent
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.mkagent as GenericIdResponse
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
