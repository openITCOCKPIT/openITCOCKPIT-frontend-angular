import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { UpsWizardGet, UpsWizardPost } from './ups-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class UpsWizardService extends WizardsService {

    public fetch(hostId: number): Observable<UpsWizardGet> {
        return this.http.get<UpsWizardGet>(`${this.proxyPath}/ups_module/wizards/ups/${hostId}.json?angular=true`).pipe(
            map((data: UpsWizardGet): UpsWizardGet => {
                return data;
            })
        );
    }

    public submit(post: UpsWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/ups_module/wizards/ups.json?angular=true`, post)
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