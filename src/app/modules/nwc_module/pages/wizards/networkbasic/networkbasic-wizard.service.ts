import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { NetworkbasicWizardGet, NetworkbasicWizardPost } from './networkbasic-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class NetworkbasicWizardService extends WizardsService {

    public fetch(hostId: number): Observable<NetworkbasicWizardGet> {
        return this.http.get<NetworkbasicWizardGet>(`${this.proxyPath}/nwc_module/wizards/networkbasic/${hostId}.json?angular=true`).pipe(
            map((data: NetworkbasicWizardGet): NetworkbasicWizardGet => {
                return data;
            })
        );
    }

    public submit(post: NetworkbasicWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/nwc_module/wizards/networkbasic.json?angular=true`, post)
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