import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    AiChatSessionsIndex,
    AiChatSessionsIndexParams,
    AiChatSessionView
} from './ai-chat-sessions.interface';

@Injectable({
    providedIn: 'root'
})
export class AiChatSessionsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(params: AiChatSessionsIndexParams): Observable<AiChatSessionsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<AiChatSessionsIndex>(`${proxyPath}/ai_module/chatsessions/index.json`, {
            params: params as {}
        }).pipe(map(data => data));
    }

    public view(id: number): Observable<AiChatSessionView> {
        const proxyPath = this.proxyPath;
        return this.http.get<AiChatSessionView>(`${proxyPath}/ai_module/chatsessions/view/${id}.json`, {
            params: {angular: true}
        }).pipe(map(data => data));
    }

    public rename(id: number, title: string): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/ai_module/chatsessions/rename/${id}.json?angular=true`, {title});
    }

    public archive(id: number): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/ai_module/chatsessions/archive/${id}.json?angular=true`, {});
    }

    public delete(id: number): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/ai_module/chatsessions/delete/${id}.json?angular=true`, {});
    }
}
