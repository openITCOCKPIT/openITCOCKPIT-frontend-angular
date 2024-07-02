import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../tokens/proxy-path.token';
import {catchError, map, Observable} from 'rxjs';

export interface ServiceDowntimeItem  {
    command: string,
    hostUuid: string,
    serviceUuid: string,
    start: number,
    end: number,
    author: string,
    comment: string,
}
export interface HostDowntimeItem  {
    command: string,
    hostUuid: string,
    start: number,
    end: number,
    author: string,
    comment: string,
    downtimetype: string
}
export interface ServiceAcknowledgeItem {
    command: string,
    hostUuid: string,
    serviceUuid: string,
    sticky: number,
    notify: boolean,
    author: string,
    comment: string,
}

export interface ServiceResetItem {
    command: string
    hostUuid: string
    serviceUuid: string
    satelliteId: number
}
export interface HostRescheduleItem {
    command: string
    hostUuid: string
    type: string
    satelliteId: number
}

export interface ServiceNotifcationItem {
    command: string
    hostUuid: string
    serviceUuid: string
}

type Commands =  ServiceDowntimeItem[] | ServiceAcknowledgeItem[] | ServiceResetItem[]
    | ServiceNotifcationItem[] | HostRescheduleItem[] | HostDowntimeItem[]

@Injectable({
    providedIn: 'root'
})
export class ExternalCommandsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public setExternalCommands(params: Commands): Observable<any> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/nagios_module/cmd/submit_bulk_naemon.json`,
            params)
            .pipe(map(result => {
                    return result
                }),
                catchError((error: any) => {
                    return 'error';
                })
            )
    }

}
