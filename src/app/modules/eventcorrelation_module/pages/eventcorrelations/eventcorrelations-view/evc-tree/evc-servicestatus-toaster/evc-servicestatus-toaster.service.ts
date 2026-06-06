import { inject, Injectable, DOCUMENT } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { EvcServicestatusToast } from '../../../eventcorrelations.interface';
import { HttpClient } from '@angular/common/http';

import { PROXY_PATH } from '../../../../../../../tokens/proxy-path.token';

@Injectable({
    providedIn: 'root'
})
export class EvcServicestatusToasterService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    // The EVCTree component will put a serviceId into the serviceId$$ BehaviorSubject when a service is hovered over.
    // The EvcServicestatusToasterComponent will subscribe to this serviceId$ Observable to get the serviceId.
    private serviceId$$: Subject<number> = new Subject<number>();
    public serviceId$: Observable<number> = this.serviceId$$.asObservable();

    // Setter method for the EVC Tree component to set the serviceId.
    public setServiceIdToaster(serviceId: number): void {
        this.serviceId$$.next(serviceId);
    }

    public getServicestatus(id: number): Observable<EvcServicestatusToast> {
        const proxyPath = this.proxyPath;
        return this.http.get<EvcServicestatusToast>(`${proxyPath}/eventcorrelation_module/eventcorrelations/getServicestatus/${id}.json`, {
            params: {
                angular: true,
                disableGlobalLoader: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }
}
