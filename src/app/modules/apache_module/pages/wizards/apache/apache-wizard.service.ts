import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { ApacheWizardGet, ApacheWizardPost, } from './apache-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class ApacheWizardService extends WizardsService {

    public fetch(hostId: number): Observable<ApacheWizardGet> {
        return this.http.get<ApacheWizardGet>(`${this.proxyPath}/apache_module/wizards/apache/${hostId}.json?angular=true`).pipe(
            map((data: ApacheWizardGet): ApacheWizardGet => {
                return data;
            })
        );
    }

    public submit(post: ApacheWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/apache_module/wizards/apache.json?angular=true`, post)
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
