import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { HyperVWizardGet, HyperVWizardPost } from './hyper-v-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class HyperVWizardService extends WizardsService {

    public fetch(hostId: number): Observable<HyperVWizardGet> {
        return this.http.get<HyperVWizardGet>(`${this.proxyPath}/hyperv_module/wizards/hyperv/${hostId}.json?angular=true`).pipe(
            map((data: HyperVWizardGet): HyperVWizardGet => {
                return data;
            })
        );
    }

    public submit(post: HyperVWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/hyperv_module/wizards/hyperv.json?angular=true`, post)
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
