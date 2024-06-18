import { inject, Injectable } from '@angular/core';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import {
    ServiceCommandArgument,
    ServiceEditApiResult,
    ServiceElements,
    ServiceLoadServicetemplateApiResult,
    ServicePost
} from './services.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class ServicesService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/services/delete/${item.id}.json?angular=true`, {});
    }


    /**********************
     *    Add action    *
     **********************/

    public loadCommands(): Observable<{ commands: SelectKeyValue[], eventhandlerCommands: SelectKeyValue[] }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            commands: SelectKeyValue[],
            eventhandlerCommands: SelectKeyValue[]
        }>(`${proxyPath}/services/loadCommands.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadElements(hostId: number, serviceId?: number): Observable<ServiceElements> {
        const proxyPath = this.proxyPath;
        let url = `${proxyPath}/services/loadElementsByHostId/${hostId}.json`;
        if (serviceId) {
            url = `${proxyPath}/services/loadElementsByHostId/${hostId}/${serviceId}.json`
        }

        return this.http.get<ServiceElements>(url, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadCommandArguments(commandId: number, serviceId?: number): Observable<ServiceCommandArgument[]> {
        const proxyPath = this.proxyPath;
        // Add action
        let url = `${proxyPath}/services/loadCommandArguments/${commandId}.json`;
        if (serviceId) {
            // Edit or copy
            url = `${proxyPath}/services/loadCommandArguments/${commandId}/${serviceId}.json`
        }

        return this.http.get<{
            servicecommandargumentvalues: ServiceCommandArgument[]
        }>(url, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.servicecommandargumentvalues;
            })
        );
    }

    public loadEventHandlerCommandArguments(commandId: number, serviceId?: number): Observable<ServiceCommandArgument[]> {
        const proxyPath = this.proxyPath;
        // Add action
        let url = `${proxyPath}/services/loadEventhandlerCommandArguments/${commandId}.json`;
        if (serviceId) {
            // Edit or copy
            url = `${proxyPath}/services/loadEventhandlerCommandArguments/${commandId}/${serviceId}.json`
        }

        return this.http.get<{
            serviceeventhandlercommandargumentvalues: ServiceCommandArgument[]
        }>(url, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.serviceeventhandlercommandargumentvalues;
            })
        );
    }

    public add(service: ServicePost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/services/add.json?angular=true`, {
            Service: service
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

    public loadServicetemplate(servicetemplateId: number, hostId: number): Observable<ServiceLoadServicetemplateApiResult> {
        const proxyPath = this.proxyPath;


        return this.http.get<ServiceLoadServicetemplateApiResult>(`${proxyPath}/services/loadServicetemplate/${servicetemplateId}/${hostId}.json`, {
            params: {
                'angular': true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    /**********************
     *    Edit action    *
     **********************/

    public getEdit(id: number): Observable<ServiceEditApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServiceEditApiResult>(`${proxyPath}/services/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }
}
