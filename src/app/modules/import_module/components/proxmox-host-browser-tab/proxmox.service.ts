import { DOCUMENT, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import {
    ProxmoxCreateSnapshotParams,
    ProxmoxGetSnapshotsParams,
    ProxmoxGetSnapshotsResult,
    ProxmoxGetTaskStatusParams,
    ProxmoxGetTaskStatusResult,
    ProxmoxGraphDataParams,
    ProxmoxGraphDataResult,
    ProxmoxRollbackSnapshotData,
    ProxmoxVirtType,
    RunProxmoxCommandApiResult
} from './proxmox-api.interface';
import { ProxmoxCommands } from './proxmox-status.enum';

@Injectable({
    providedIn: 'root',
})
export class ProxmoxService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public sendProxmoxCommand(hostId: number, nodeName: string, vmid: string, command: ProxmoxCommands, type: ProxmoxVirtType, params: any = {}): Observable<RunProxmoxCommandApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.post<RunProxmoxCommandApiResult>(`${proxyPath}/import_module/Proxmox/command/${hostId}.json`, {
            node: nodeName,
            vmid: vmid,
            command: command,
            type: type,
            params: params
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getGraphData(hostId: number, params: ProxmoxGraphDataParams): Observable<ProxmoxGraphDataResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<ProxmoxGraphDataResult>(`${proxyPath}/import_module/Proxmox/graph/${hostId}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data
            })
        );
    }

    public getSnapshots(hostId: number, params: ProxmoxGetSnapshotsParams): Observable<ProxmoxGetSnapshotsResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<ProxmoxGetSnapshotsResult>(`${proxyPath}/import_module/Proxmox/snapshots/${hostId}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data
            })
        );
    }

    public createSnapshot(hostId: number, data: ProxmoxCreateSnapshotParams): Observable<RunProxmoxCommandApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.post<RunProxmoxCommandApiResult>(`${proxyPath}/import_module/Proxmox/snapshots/${hostId}.json`, data).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getTaskStatus(hostId: number, params: ProxmoxGetTaskStatusParams): Observable<ProxmoxGetTaskStatusResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<ProxmoxGetTaskStatusResult>(`${proxyPath}/import_module/Proxmox/get_task/${hostId}.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data
            })
        );
    }

    public rollbackSnapshot(hostId: number, data: ProxmoxRollbackSnapshotData): Observable<RunProxmoxCommandApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.post<RunProxmoxCommandApiResult>(`${proxyPath}/import_module/Proxmox/rollback_snapshpot/${hostId}.json`, data).pipe(
            map(data => {
                return data;
            })
        )
    }

    public deleteSnapshot(hostId: number, data: ProxmoxRollbackSnapshotData): Observable<RunProxmoxCommandApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.post<RunProxmoxCommandApiResult>(`${proxyPath}/import_module/Proxmox/delete_snapshpot/${hostId}.json`, data).pipe(
            map(data => {
                return data;
            })
        )
    }

}
