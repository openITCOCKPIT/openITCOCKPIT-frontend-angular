import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../tokens/proxy-path.token';
import { catchError, map, Observable } from 'rxjs';
import { ExternalCommandDefinitionRoot } from '../modules/nagios_module/pages/cmd/ExternalCommands.interface';

export interface ServiceDowntimeItem {
    command: string,
    hostUuid: string,
    serviceUuid: string,
    start: number,
    end: number,
    author: string,
    comment: string,
}

export interface HostDowntimeItem {
    command: string,
    hostUuid: string,
    start: number,
    end: number,
    author: string,
    comment: string,
    downtimetype: string | number
}

export interface HostEnableNotificationsItem {
    command: string,
    hostUuid: string,
    type: string,
}

export interface HostDisableNotificationsItem {
    command: string,
    hostUuid: string,
    type: string,
}

export interface HostAcknowledgeItem {
    command: string,
    hostUuid: string,
    hostAckType: 'hostOnly' | 'hostAndServices',
    sticky: number,
    notify: boolean,
    author: string,
    comment: string,
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
    type: 'hostOnly' | 'hostAndServices'
    satelliteId: number
}

export interface ServiceNotifcationItem {
    command: string
    hostUuid: string
    serviceUuid: string
}

type Commands = ServiceDowntimeItem[] | HostAcknowledgeItem[] | ServiceAcknowledgeItem[] | ServiceResetItem[]
    | ServiceNotifcationItem[] | HostRescheduleItem[] | HostDowntimeItem[] | HostEnableNotificationsItem[]

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
            params
        )
            .pipe(map(result => {
                    return result
                }),
                catchError((error: any) => {
                    return 'error';
                })
            )
    }


    public getExternalCommandsWithParams(): Observable<ExternalCommandDefinitionRoot> {
        const proxyPath = this.proxyPath;


        return this.http.get<{
            externalCommands: ExternalCommandDefinitionRoot
        }>(`${proxyPath}/nagios_module/cmd/index.json`).pipe(
            map(data => {
                return data.externalCommands;
            })
        );
    }

}
