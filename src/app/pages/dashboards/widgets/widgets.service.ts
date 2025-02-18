import { inject, Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../tokens/proxy-path.token';
import { StatuscountResponse } from '../../browsers/browsers.interface';
import { TodayWidgetResponse, WelcomeWidgetResponse } from './widgets.interface';
import { WidgetGetForRender } from '../dashboards.interface';

@Injectable({
    providedIn: 'root'
})
export class WidgetsService {

    private readonly onResizeEnded$$ = new Subject<KtdResizeEnd>();
    public readonly onResizeEnded$ = this.onResizeEnded$$.asObservable();

    private readonly onLayoutUpdated$$ = new Subject<KtdGridLayout>();
    public readonly onLayoutUpdated$ = this.onLayoutUpdated$$.asObservable();


    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    /**
     * Will be triggered when a single widget is resized
     * @param event KtdResizeEnd
     */
    onResizeEnded(event: KtdResizeEnd) {
        this.onResizeEnded$$.next(event);
    }

    /**
     * Will be triggered when the layout is updated
     * This can happen by resizing a widget, moving a widget or adding/removing a widget etc...
     * @param event KtdGridLayout
     */
    onLayoutUpdated(event: KtdGridLayout) {
        this.onLayoutUpdated$$.next(event);
    }

    public loadStatusCount(recursive: boolean = true): Observable<StatuscountResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<StatuscountResponse>(`${proxyPath}/angular/statuscount.json`, {
            params: {
                angular: true,
                recursive: recursive
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadWelcomeWidget(): Observable<WelcomeWidgetResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<WelcomeWidgetResponse>(`${proxyPath}/dashboards/welcomeWidget.json`).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadTodayWidget(widget: WidgetGetForRender): Observable<TodayWidgetResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<TodayWidgetResponse>(`${proxyPath}/dashboards/todayWidget.json`, {
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
