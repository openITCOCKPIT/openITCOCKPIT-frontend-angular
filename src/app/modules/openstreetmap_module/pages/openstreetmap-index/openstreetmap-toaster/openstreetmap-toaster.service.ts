import { inject, Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { PROXY_PATH } from '../../../../../tokens/proxy-path.token';
import {OpenstreetmapAcls} from '../../openstreetmap.interface'
import {
    EvcServicestatusToast
} from '../../../../eventcorrelation_module/pages/eventcorrelations/eventcorrelations.interface';

@Injectable({
    providedIn: 'root'
})
export class OpenstreetmapToasterService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    private rights$$: Subject<OpenstreetmapAcls> = new Subject<OpenstreetmapAcls>();
    public rights$: Observable<OpenstreetmapAcls> = this.rights$$.asObservable();
    private containerIds$$: Subject<number[]> = new Subject<number[]>();
    public containerIds$: Observable<number[]> = this.containerIds$$.asObservable();

    public setContainerIdsToaster(containerIds: number[]): void {
        this.containerIds$$.next(containerIds);
    }
    public setAclsToaster(rights: OpenstreetmapAcls): void {
       // console.log(rights);
        this.rights$$.next(rights);
    }

    public setToasterProperties(containerIds: number[], rights: OpenstreetmapAcls ): void {
        this.containerIds$$.next(containerIds);
        this.rights$$.next(rights);
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
