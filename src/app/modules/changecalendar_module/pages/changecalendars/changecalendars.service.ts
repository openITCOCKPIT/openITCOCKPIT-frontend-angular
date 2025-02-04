import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    AddChangeCalendar,
    ChangeCalendarsIndex,
    ChangeCalendarsIndexParams,
    EditableChangecalendar, EditChangecalendarRoot
} from './changecalendars.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';


@Injectable({
    providedIn: 'root'
})
export class ChangecalendarsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: ChangeCalendarsIndexParams): Observable<ChangeCalendarsIndex> {
        return this.http.get<ChangeCalendarsIndex>(`${this.proxyPath}/changecalendar_module/changecalendars/index.json`, {
            params: {
                ...params
            }
        }).pipe(
            map((data: ChangeCalendarsIndex): ChangeCalendarsIndex => {
                return data;
            })
        );
    }

    public getEdit(id: number): Observable<EditChangecalendarRoot> {
        return this.http.get<EditChangecalendarRoot>(`${this.proxyPath}/changecalendar_module/changecalendars/edit/${id}.json?angular=true`)
            .pipe(
                map((data: EditChangecalendarRoot) => {
                    return data;
                })
            );
    }

    public updateChangecalendar(changecalendar: EditChangecalendarRoot): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/changecalendar_module/changecalendars/edit/${changecalendar.changeCalendar.id}.json?angular=true`, changecalendar)
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: data.changeCalendar as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );

    }

    public addChangeCalendar(changeCalendar: AddChangeCalendar): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/changecalendar_module/changecalendars/add.json?angular=true`, changeCalendar)
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: data as GenericIdResponse
                    };
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of({
                        success: false,
                        data: err
                    });
                })
            );

    }

    public delete(item: DeleteAllItem): Observable<Object> {
        return this.http.post(`${this.proxyPath}/changecalendar_module/changecalendars/delete/${item.id}.json`, {});
    }
}