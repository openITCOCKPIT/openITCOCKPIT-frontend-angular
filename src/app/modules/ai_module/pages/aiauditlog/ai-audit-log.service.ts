import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { AiAuditLogIndex } from './ai-audit-log.interface';

@Injectable({
    providedIn: 'root'
})
export class AiAuditLogService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: {}): Observable<AiAuditLogIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<AiAuditLogIndex>(`${proxyPath}/ai_module/auditlog/index.json`, {
            params: params as {}
        }).pipe(map(data => data));
    }
}
