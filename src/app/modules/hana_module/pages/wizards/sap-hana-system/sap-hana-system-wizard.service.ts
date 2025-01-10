import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { SapHanaSystemWizardGet, SapHanaSystemWizardPost } from './sap-hana-system-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class SapHanaSystemWizardService extends WizardsService {

    public fetch(hostId: number): Observable<SapHanaSystemWizardGet> {
        return this.http.get<SapHanaSystemWizardGet>(`${this.proxyPath}/hana_module/wizards/saphana/${hostId}.json?angular=true&typeId=sap-hana-system`).pipe(
            map((data: SapHanaSystemWizardGet): SapHanaSystemWizardGet => {
                return data;
            })
        );
    }

    public submit(post: SapHanaSystemWizardPost): Observable<GenericResponseWrapper> {
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