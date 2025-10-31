import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { CiscoNetworkWizardGet, CiscoNetworkWizardPost } from './cisco-network-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class CiscoNetworkWizardService extends WizardsService {

    public fetch(hostId: number): Observable<CiscoNetworkWizardGet> {
        return this.http.get<CiscoNetworkWizardGet>(`${this.proxyPath}/cisco_module/wizards/cisco_network/${hostId}.json?angular=true`).pipe(
            map((data: CiscoNetworkWizardGet): CiscoNetworkWizardGet => {
                return data;
            })
        );
    }

    public submit(post: CiscoNetworkWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/cisco_module/wizards/cisco_network.json?angular=true`, post)
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
