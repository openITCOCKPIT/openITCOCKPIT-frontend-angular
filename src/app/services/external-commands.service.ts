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

export interface HostProcessCheckResultItem {
    command: string,
    hostUuid: string,
    plugin_output: string,
    long_output: string,
    status_code: number,
    forceHardstate: boolean
    maxCheckAttempts: number
}

export interface ServiceProcessCheckResultItem {
    command: string,
    hostUuid: string,
    serviceUuid: string,
    plugin_output: string,
    long_output: string,
    status_code: number,
    forceHardstate: boolean,
    maxCheckAttempts: number,
}

export interface EnableOrDisableHostFlapDetectionItem {
    command: string,
    hostUuid: string,
    condition: 0 | 1, // 0 - disable, 1 - enable
}

export interface HostSendCustomNotificationItem {
    command: string,
    hostUuid: string,
    options: 0 | 1 | 2 | 3, // 1 = force, 2 = broadcast, 3 = force and broadcast
    author: string,
    comment: string,
}

export interface ServiceSendCustomNotificationItem {
    command: string,
    hostUuid: string,
    serviceUuid: string,
    options: 0 | 1 | 2 | 3, // 1 = force, 2 = broadcast, 3 = force and broadcast
    author: string,
    comment: string,
}


type Commands =
    ServiceDowntimeItem[]
    | HostAcknowledgeItem[]
    | ServiceAcknowledgeItem[]
    | ServiceResetItem[]
    | ServiceNotifcationItem[]
    | HostRescheduleItem[]
    | HostDowntimeItem[]
    | HostEnableNotificationsItem[]
    | HostDisableNotificationsItem[]
    | HostProcessCheckResultItem[]
    | ServiceProcessCheckResultItem[]
    | EnableOrDisableHostFlapDetectionItem[]
    | HostSendCustomNotificationItem[]
    | ServiceSendCustomNotificationItem[]

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
