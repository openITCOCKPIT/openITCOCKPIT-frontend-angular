import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { OracleWizardGet, OracleWizardPost } from './oracle-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class OracleWizardService extends WizardsService {

    public fetch(hostId: number): Observable<OracleWizardGet> {
        return this.http.get<OracleWizardGet>(`${this.proxyPath}/oracle_module/wizards/oracle/${hostId}.json?angular=true&typeId=sap-hana-tenant`).pipe(
            map((data: OracleWizardGet): OracleWizardGet => {
                return data;
            })
        );
    }

    public submit(post: OracleWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/oracle_module/wizards/oracle.json?angular=true`, post)
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