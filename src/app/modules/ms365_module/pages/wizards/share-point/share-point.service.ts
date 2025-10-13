import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { Ms365SharePointWizardGet, Ms365SharePointWizardPost } from './share-point.interface';

@Injectable({
    providedIn: 'root'
})
export class M365SharePointService extends WizardsService {
    public fetch(hostId: number): Observable<Ms365SharePointWizardGet> {
        return this.http.get<Ms365SharePointWizardGet>(`${this.proxyPath}/ms365_module/wizards/sharepoint/${hostId}.json?angular=true`).pipe(
            map((data: Ms365SharePointWizardGet): Ms365SharePointWizardGet => {
                return data;
            })
        );
    }

    public submit(post: Ms365SharePointWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/ms365_module/wizards/sharepoint.json?angular=true`, post)
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
