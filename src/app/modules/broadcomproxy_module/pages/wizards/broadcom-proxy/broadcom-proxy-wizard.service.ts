import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { BroadcomProxyWizardGet, BroadcomProxyWizardPost } from './broadcom-proxy-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class BroadcomProxyWizardService extends WizardsService {

    public fetch(hostId: number): Observable<BroadcomProxyWizardGet> {
        return this.http.get<BroadcomProxyWizardGet>(`${this.proxyPath}/broadcom_proxy_module/wizards/broadcomProxy/${hostId}.json?angular=true`).pipe(
            map((data: BroadcomProxyWizardGet): BroadcomProxyWizardGet => {
                return data;
            })
        );
    }

    public submit(post: BroadcomProxyWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/broadcom_proxy_module/wizards/broadcomProxy.json?angular=true`, post)
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
