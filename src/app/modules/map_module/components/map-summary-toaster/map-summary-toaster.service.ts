import { inject, Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { MapSummaryRoot } from '../../pages/mapeditors/Mapeditors.interface';

@Injectable({
    providedIn: 'root'
})
export class MapSummaryToasterService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    // The MapView component will put an item and boolean into the itemSubject$$ BehaviorSubject when a service is hovered over.
    // The MapSummaryToasterComponent will subscribe to this itemObservable$ Observable to get the item.
    private itemSubject$$: Subject<{ item: any, summary: boolean }> = new Subject<{ item: any, summary: boolean }>();
    public itemObservable$: Observable<{ item: any, summary: boolean }> = this.itemSubject$$.asObservable();

    // Setter method for the MapView component to set the item.
    public setItemToaster(item: any, summary: boolean): void {
        this.itemSubject$$.next({item, summary});
    }

    public getMapsummary(item: any, summary: boolean): Observable<MapSummaryRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<MapSummaryRoot>(`${proxyPath}/map_module/mapeditors/mapsummary/.json`, {
            params: {
                'angular': true,
                'objectId': item.object_id,
                'disableGlobalLoader': true,
                'type': item.type,
                'summary': summary
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }
}
