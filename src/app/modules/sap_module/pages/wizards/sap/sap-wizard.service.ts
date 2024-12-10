import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { SapWizardGet, SapWizardPost } from './sap-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class SapWizardService extends WizardsService {

    public fetch(hostId: number): Observable<SapWizardGet> {
        return this.http.get<SapWizardGet>(`${this.proxyPath}/sap_module/wizards/sap/${hostId}.json?angular=true&typeId=sap-hana-tenant`).pipe(
            map((data: SapWizardGet): SapWizardGet => {
                return data;
            })
        );
    }

    public submit(post: SapWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/sap_module/wizards/sap.json?angular=true`, post)
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