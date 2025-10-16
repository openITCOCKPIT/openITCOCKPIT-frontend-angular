import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { CiscoWlcWizardGet, CiscoWlcWizardPost } from './cisco-wlc-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class CiscoWlcWizardService extends WizardsService {

    public fetch(hostId: number): Observable<CiscoWlcWizardGet> {
        return this.http.get<CiscoWlcWizardGet>(`${this.proxyPath}/cisco_wlc_module/wizards/cisco_wlc/${hostId}.json?angular=true`).pipe(
            map((data: CiscoWlcWizardGet): CiscoWlcWizardGet => {
                return data;
            })
        );
    }

    public submit(post: CiscoWlcWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/cisco_wlc_module/wizards/cisco_wlc.json?angular=true`, post)
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
