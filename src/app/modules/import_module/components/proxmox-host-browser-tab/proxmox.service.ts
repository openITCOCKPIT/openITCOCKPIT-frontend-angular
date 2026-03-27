import { DOCUMENT, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { RunProxmoxCommandApiResult } from './proxmox-api.interface';
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

    public sendProxmoxCommand(hostId: number, nodeName: string, vmid: string, command: ProxmoxCommands, type: 'qemu' | 'lxc'): Observable<RunProxmoxCommandApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.post<RunProxmoxCommandApiResult>(`${proxyPath}/import_module/Proxmox/command/${hostId}.json`, {
            node: nodeName,
            vmid: vmid,
            command: command,
            type: type
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
