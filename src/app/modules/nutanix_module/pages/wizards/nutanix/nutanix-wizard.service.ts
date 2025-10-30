import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { NutanixWizardGet, NutanixWizardPost } from './nutanix-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class NutanixWizardService extends WizardsService {

    public fetch(hostId: number): Observable<NutanixWizardGet> {
        return this.http.get<NutanixWizardGet>(`${this.proxyPath}/nutanix_module/wizards/nutanix/${hostId}.json?angular=true`).pipe(
            map((data: NutanixWizardGet): NutanixWizardGet => {
                return data;
            })
        );
    }

    public submit(post: NutanixWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/nutanix_module/wizards/nutanix.json?angular=true`, post)
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
