import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import {
    Ms365ServiceDiscovery,
    Ms365ServiceStatusWizardGet,
    Ms365ServiceStatusWizardPost
} from './service-status.interface';

@Injectable({
    providedIn: 'root'
})
export class M365ServiceStatusService extends WizardsService {

    public fetch(hostId: number): Observable<Ms365ServiceStatusWizardGet> {
        return this.http.get<Ms365ServiceStatusWizardGet>(`${this.proxyPath}/proxmox_module/wizards/proxmox/${hostId}.json?angular=true`).pipe(
            map((data: Ms365ServiceStatusWizardGet): Ms365ServiceStatusWizardGet => {
                return data;
            })
        );
    }

    public submit(post: Ms365ServiceStatusWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/ms365_module/wizards/serviceStatus.json?angular=true`, post)
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: null
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

    public executeServiceDiscovery(post: Ms365ServiceStatusWizardPost): Observable<Ms365ServiceDiscovery | GenericResponseWrapper> {
        return this.http.post<Ms365ServiceDiscovery>(`${this.proxyPath}/ms365_module/wizards/executeServiceDiscovery/${post.host_id}.json?angular=true`, post)
            .pipe(
                map((data: Ms365ServiceDiscovery) => {
                    return data
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

}
