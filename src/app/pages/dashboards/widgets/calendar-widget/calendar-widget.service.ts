import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { WidgetGetForRender } from '../../dashboards.interface';
import { CalendarResponse } from './calendar-widget.interface';


@Injectable({
    providedIn: 'root'
})
export class CalendarWidgetService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);


    public getCalendarWidget(widget: WidgetGetForRender): Observable<CalendarResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<CalendarResponse>(`${proxyPath}/dashboards/calendarWidget.json`, {
            params: {
                angular: true,
                'widgetId': widget.id
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
