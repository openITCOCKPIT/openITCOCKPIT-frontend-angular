import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { MssqlWizardGet, MssqlWizardPost } from './mssql-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class MssqlWizardService extends WizardsService {

    public fetch(hostId: number): Observable<MssqlWizardGet> {
        return this.http.get<MssqlWizardGet>(`${this.proxyPath}/mssql_module/wizards/mssql/${hostId}.json?angular=true`).pipe(
            map((data: MssqlWizardGet): MssqlWizardGet => {
                return data;
            })
        );
    }

    public submit(post: MssqlWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/mssql_module/wizards/mssql.json?angular=true`, post)
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