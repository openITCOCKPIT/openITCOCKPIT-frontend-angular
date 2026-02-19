import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { ApacheHttpWizardGet, ApacheHttpWizardPost, } from './apache-http-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class ApacheHttpWizardService extends WizardsService {

    public fetch(hostId: number): Observable<ApacheHttpWizardGet> {
        return this.http.get<ApacheHttpWizardGet>(`${this.proxyPath}/apache_module/wizards/apache_http/${hostId}.json?angular=true`).pipe(
            map((data: ApacheHttpWizardGet): ApacheHttpWizardGet => {
                return data;
            })
        );
    }

    public submit(post: ApacheHttpWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/apache_module/wizards/apache_http.json?angular=true`, post)
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
