import { inject, Injectable, DOCUMENT } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PROXY_PATH } from '../../../../../tokens/proxy-path.token';

@Injectable({
    providedIn: 'root'
})
export class OpenstreetmapToasterService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }
    private containerIds$$: Subject<number[]> = new Subject<number[]>();
    public containerIds$: Observable<number[]> = this.containerIds$$.asObservable();

    public setContainerIdsToaster(containerIds: number[]): void {
        this.containerIds$$.next(containerIds);
    }

    public loadOpenstreetMapSumaryState(containerIds: number[]): Observable<any> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/openstreetmap_module/openstreetmap/openstreetmapsummary.json`, {
            params: {
                angular: true,
                disableGlobalLoader: true,
                "containerIds[]": containerIds
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

}
