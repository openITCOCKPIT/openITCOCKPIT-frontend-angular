import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { NetAppWizardGet, NetAppWizardPost } from './net-app-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class NetAppWizardService extends WizardsService {

    public fetch(hostId: number): Observable<NetAppWizardGet> {
        return this.http.get<NetAppWizardGet>(`${this.proxyPath}/net_app_module/wizards/netapp/${hostId}.json?angular=true`).pipe(
            map((data: NetAppWizardGet): NetAppWizardGet => {
                return data;
            })
        );
    }

    public submit(post: NetAppWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/net_app_module/wizards/netapp.json?angular=true`, post)
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
}
