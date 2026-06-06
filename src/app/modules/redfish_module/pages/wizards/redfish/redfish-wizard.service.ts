import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { RedfishWizardGet, RedfishWizardPost } from './redfish-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class RedfishWizardService extends WizardsService {

    public fetch(hostId: number): Observable<RedfishWizardGet> {
        return this.http.get<RedfishWizardGet>(`${this.proxyPath}/redfish_module/wizards/redfish/${hostId}.json?angular=true`).pipe(
            map((data: RedfishWizardGet): RedfishWizardGet => {
                return data;
            })
        );
    }

    public submit(post: RedfishWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/redfish_module/wizards/redfish.json?angular=true`, post)
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
