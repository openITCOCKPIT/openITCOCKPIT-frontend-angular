import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { CitrixNetscalerWizardPost } from './citrix-netscaler-wizard.interface';
import { WizardGet } from '../../../../../pages/wizards/wizards.interface';

@Injectable({
    providedIn: 'root'
})
export class CitrixNetscalerWizardService extends WizardsService {

    public fetch(hostId: number): Observable<WizardGet> {
        return this.http.get<WizardGet>(`${this.proxyPath}/citrix_module/wizards/citrixNetscaler/${hostId}.json?angular=true`).pipe(
            map((data: WizardGet): WizardGet => {
                return data;
            })
        );
    }

    public submit(post: CitrixNetscalerWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/citrix_module/wizards/citrixNetscaler.json?angular=true`, post)
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
