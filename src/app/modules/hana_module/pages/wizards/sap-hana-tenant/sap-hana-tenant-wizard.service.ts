import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { SapHanaTenantWizardGet, SapHanaTenantWizardPost } from './sap-hana-tenant-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class SapHanaTenantWizardService extends WizardsService {

    public fetch(hostId: number): Observable<SapHanaTenantWizardGet> {
        return this.http.get<SapHanaTenantWizardGet>(`${this.proxyPath}/hana_module/wizards/saphana/${hostId}.json?angular=true&typeId=sap-hana-tenant`).pipe(
            map((data: SapHanaTenantWizardGet): SapHanaTenantWizardGet => {
                return data;
            })
        );
    }

    public submit(post: SapHanaTenantWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/hana_module/wizards/saphana.json?angular=true`, post)
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