import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SnmpttEntryIndexParams, SnmpttEntryIndexRoot } from './snmptt.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { DeleteAllItem, DeleteAllModalService } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class SnmpttService implements DeleteAllModalService {
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: SnmpttEntryIndexParams): Observable<SnmpttEntryIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<SnmpttEntryIndexRoot>(`${proxyPath}/snmp_trap_module/SnmpttList/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                data.snmptt_entries.forEach(record => {
                    // Use lowercase for severity ("ok", "warning", "critical")
                    // This gets used to match the css class
                    record.Snmptt.severity = record.Snmptt.severity.toString().toLowerCase();
                });

                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/snmp_trap_module/SnmpttList/delete/${item.id}.json?angular=true`, {});
    }
}
