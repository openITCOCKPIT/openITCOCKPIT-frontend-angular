import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { MailinglistPost, MailinglistsIndex, MailinglistsIndexParams } from './mailinglists.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

@Injectable({
    providedIn: 'root'
})
export class MailinglistsService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getMailinglists(params: MailinglistsIndexParams): Observable<MailinglistsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<MailinglistsIndex>(`${proxyPath}/scm_module/mailinglists/index.json`, {
            params: params as {} // cast MailinglistsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadMailinglistsByContainerId(containerId: number, selected: any[]): Observable<SelectKeyValue[]> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<{
            users: SelectKeyValue[]
        }>(`${proxyPath}/scm_module/mailinglists/loadMailinglistsByContainerId.json`, {
            params: {
                angular: true,
                containerId: containerId,
                'selected[]': selected,
            }
        }).pipe(
            map(data => {
                return data.users;
            })
        );
    }

    /**********************
     *    Add action    *
     **********************/
    public createMailinglist(mailinglist: MailinglistPost) {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/scm_module/mailinglists/add.json?angular=true`, mailinglist)
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

    /**********************
     *    Edit action    *
     **********************/
    public getMailinglist(id: number): Observable<MailinglistPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ mailinglist: MailinglistPost }>(`${proxyPath}/scm_module/mailinglists/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.mailinglist;
            })
        );
    }

    public saveMailinglistEdit(mailinglist: MailinglistPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/scm_module/mailinglists/edit/${mailinglist.id}.json`, mailinglist)
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


    /**********************
     *    Delete action    *
     **********************/
    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/scm_module/mailinglists/delete/${item.id}.json?angular=true`, {});
    }

}
