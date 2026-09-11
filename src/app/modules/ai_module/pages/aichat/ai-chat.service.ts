import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import {
    AiChatIndex,
    AiChatPollResponse,
    AiChatSendResponse,
    AiChatStartResponse
} from './ai-chat.interface';
import { GenericResponseWrapper } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class AiChatService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getIndex(): Observable<AiChatIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<AiChatIndex>(`${proxyPath}/ai_module/chat/index.json`, {
            params: {angular: true}
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public start(agentId: number): Observable<AiChatStartResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<AiChatStartResponse>(`${proxyPath}/ai_module/chat/start.json?angular=true`, {
            agent_id: agentId
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    /**
     * Hands a message to the queue and returns as soon as it is stored.
     *
     * The answer arrives through poll(), because a turn can spend a minute or
     * more waiting on a model and a request that waits with it would hold a
     * PHP-FPM worker for that whole time.
     */
    public send(sessionId: number, message: string): Observable<AiChatSendResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<AiChatSendResponse>(`${proxyPath}/ai_module/chat/send.json?angular=true`, {
            session_id: sessionId,
            message: message
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    /**
     * Everything that happened since sinceMessageId.
     *
     * The cursor is a message id rather than a timestamp: two messages can
     * share a second, and a conversation that reorders itself is worse than one
     * that arrives late.
     */
    public poll(sessionId: number, sinceMessageId: number): Observable<AiChatPollResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<AiChatPollResponse>(`${proxyPath}/ai_module/chat/poll.json`, {
            params: {
                angular: true,
                session_id: sessionId,
                since_message_id: sinceMessageId
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public cancel(turnId: number): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/ai_module/chat/cancel.json?angular=true`, {
            turn_id: turnId
        }).pipe(
            map(data => {
                return {success: true, data: data};
            })
        );
    }

    public confirm(confirmationId: number, comment: string): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/ai_module/toolconfirmations/confirm/${confirmationId}.json?angular=true`, {
            comment: comment
        }).pipe(
            map(data => {
                return {success: true, data: data};
            })
        );
    }

    public decline(confirmationId: number, comment: string): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/ai_module/toolconfirmations/decline/${confirmationId}.json?angular=true`, {
            comment: comment
        }).pipe(
            map(data => {
                return {success: true, data: data};
            })
        );
    }
}
