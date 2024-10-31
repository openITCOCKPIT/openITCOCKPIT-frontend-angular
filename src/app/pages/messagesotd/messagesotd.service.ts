import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    GenericIdResponse,
    GenericResponseWrapper,
    GenericSuccessResponse,
    GenericValidationError
} from '../../generic-responses';
import {
    CurrentMessageOfTheDay,
    EditableMessageOfTheDay,
    MessageOfTheDay,
    MessagesOtdIndexGet,
    MessagesOtdIndexParams
} from './messagesotd.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class MessagesOfTheDayService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: MessagesOtdIndexParams): Observable<MessagesOtdIndexGet> {
        return this.http.get<MessagesOtdIndexGet>(`${this.proxyPath}/messagesOtd/index.json?angular=true`, {
            params: params as {}
        }).pipe(
            map((data: MessagesOtdIndexGet) => {
                return data;
            })
        )
    }

    public addMessageOfTheDay(messageOfTheDay: MessageOfTheDay): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericResponseWrapper>(`${proxyPath}/messagesOtd/add.json?angular=true`, {MessagesOtd: messageOfTheDay})
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: data as unknown as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err: GenericValidationError = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }

    public getCurrentMessageOfTheDay(): Observable<CurrentMessageOfTheDay> {
        return this.http.get<CurrentMessageOfTheDay>(`${this.proxyPath}/angular/message_of_the_day.json`, {
            params: {
                angular: 'true'
            }
        });
    }

    public getEdit(id: number): Observable<EditableMessageOfTheDay> {
        return this.http.get<{
            messageOtd: EditableMessageOfTheDay
        }>(`${this.proxyPath}/messagesOtd/edit/${id}.json?angular=true`)
            .pipe(
                map((data: { messageOtd: EditableMessageOfTheDay }) => {
                    return data.messageOtd;
                })
            )
    }

    public updateMessageOfTheDay(messageOfTheDay: EditableMessageOfTheDay): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/messagesOtd/edit/${messageOfTheDay.id}.json?angular=true`, {MessagesOtd: messageOfTheDay})
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: data.messageOtd as unknown as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err: GenericValidationError = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );
    }

    public delete(item: DeleteAllItem): Observable<GenericSuccessResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericSuccessResponse>(`${proxyPath}/messagesOtd/delete/${item.id}.json?angular=true`, {})
            .pipe(
                map(data => {
                    return data;
                }),
                catchError((error: any) => {
                    const err: GenericSuccessResponse = {
                        success: false
                    }
                    return of(err);
                })
            );
    }
}
