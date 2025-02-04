import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { ChangeCalendarsIndex, ChangeCalendarsIndexParams } from './changecalendars.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';


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

    public delete(item: DeleteAllItem): Observable<Object> {
        return this.http.post(`${this.proxyPath}/changecalendar_module/changecalendars/delete/${item.id}.json`, {});
    }
}