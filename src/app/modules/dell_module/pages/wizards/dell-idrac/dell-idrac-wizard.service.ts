import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { DellIdracWizardGet, DellIdracWizardPost } from './dell-idrac-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class DellIdracWizardService extends WizardsService {

    public fetch(hostId: number): Observable<DellIdracWizardGet> {
        return this.http.get<DellIdracWizardGet>(`${this.proxyPath}/dell_module/wizards/dellIdrac/${hostId}.json?angular=true`).pipe(
            map((data: DellIdracWizardGet): DellIdracWizardGet => {
                return data;
            })
        );
    }

    public submit(post: DellIdracWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/nwc_module/wizards/dellIdrac.json?angular=true`, post)
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
