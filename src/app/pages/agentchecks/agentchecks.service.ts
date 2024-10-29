import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { AgentcheckPost, AgentchecksIndexParams, AgentchecksIndexRoot } from './agentchecks.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class AgentchecksService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: AgentchecksIndexParams): Observable<AgentchecksIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<AgentchecksIndexRoot>(`${proxyPath}/agentchecks/index.json`, {
            params: params as {} // cast TenantsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadServicetemplates(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            servicetemplates: SelectKeyValue[]
        }>(`${proxyPath}/agentchecks/loadServicetemplates.json`).pipe(
            map(data => {
                return data.servicetemplates;
            })
        )
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/agentchecks/delete/${item.id}.json`, {});
    }

    public add(agentcheck: AgentcheckPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/agentchecks/add.json?angular=true`, {
            Agentcheck: agentcheck
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

    public getAgentcheckEdit(id: number): Observable<AgentcheckPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ agentcheck: AgentcheckPost }>(`${proxyPath}/agentchecks/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.agentcheck;
            })
        );
    }

    public saveAgentcheckEdit(agentcheck: AgentcheckPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/agentchecks/edit/${agentcheck.id}.json?angular=true`, {
            Agentcheck: agentcheck
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
