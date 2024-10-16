import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { GenericSuccessResponse, GenericValidationError } from '../../generic-responses';
import {
    CurrentMessageOfTheDay,
    EditableMessageOfTheDay,
    MessageOfTheDay,
    MessagesOtdIndexGet,
    MessagesOtdIndexParams
} from './messagesotd.interface';

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

    public addMessageOfTheDay(messageOfTheDay: MessageOfTheDay): Observable<boolean | GenericValidationError> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/messagesOtd/add.json?angular=true`, messageOfTheDay)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return true;
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of(err);
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
        return this.http.get<EditableMessageOfTheDay>(`${this.proxyPath}/messagesOtd/edit/${id}.json`, {
            params: {
                angular: 'true'
            }
        });
    }

    public updateMessageOfTheDay(messageOfTheDay: EditableMessageOfTheDay): Observable<boolean | GenericValidationError> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/messagesOtd/edit/${messageOfTheDay.id}.json?angular=true`, messageOfTheDay)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return true;
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of(err);
                })
            );
    }

    public delete(id: number): Observable<GenericSuccessResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericSuccessResponse>(`${proxyPath}/messagesOtd/delete/${id}.json?angular=true`, {})
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
