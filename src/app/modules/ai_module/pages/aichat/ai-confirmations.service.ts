import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { AiConfirmationsIndex } from './ai-confirmations.interface';

@Injectable({
    providedIn: 'root'
})
export class AiConfirmationsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(): Observable<AiConfirmationsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<AiConfirmationsIndex>(`${proxyPath}/ai_module/toolconfirmations/index.json`, {
            params: {angular: true}
        }).pipe(map(data => data));
    }

    public confirm(id: number, comment: string): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/ai_module/toolconfirmations/confirm/${id}.json?angular=true`, {comment});
    }

    public decline(id: number, comment: string): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/ai_module/toolconfirmations/decline/${id}.json?angular=true`, {comment});
    }
}
