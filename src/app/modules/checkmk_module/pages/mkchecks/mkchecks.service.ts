import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { MkcheckPost, MkchecksIndexParams, MkchecksIndexRoot } from './mkchecks.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class MkchecksService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: MkchecksIndexParams): Observable<MkchecksIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MkchecksIndexRoot>(`${proxyPath}/checkmk_module/mkchecks/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/checkmk_module/mkchecks/delete/${item.id}.json`, {});
    }

    public loadServicetemplates(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            servicetemplates: SelectKeyValue[]
        }>(`${proxyPath}/checkmk_module/mkchecks/loadServicetemplates.json`).pipe(
            map(data => {
                return data.servicetemplates;
            })
        )
    }

    public add(mkcheck: MkcheckPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/checkmk_module/mkchecks/add.json?angular=true`, {
            Mkcheck: mkcheck
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.mkcheck as GenericIdResponse
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

    public getMkcheckEdit(id: number): Observable<MkcheckPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ mkcheck: MkcheckPost }>(`${proxyPath}/checkmk_module/mkchecks/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.mkcheck;
            })
        );
    }

    public saveMkcheckEdit(mkcheck: MkcheckPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/checkmk_module/mkchecks/edit/${mkcheck.id}.json?angular=true`, {
            Mkcheck: mkcheck
        })
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data.mkcheck as GenericIdResponse
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
