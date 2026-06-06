import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { NextcloudWizardGet, NextcloudWizardPost } from './nextcloud-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class NextcloudWizardService extends WizardsService {

    public fetch(hostId: number): Observable<NextcloudWizardGet> {
        return this.http.get<NextcloudWizardGet>(`${this.proxyPath}/nextcloud_module/wizards/nextcloud/${hostId}.json?angular=true`).pipe(
            map((data: NextcloudWizardGet): NextcloudWizardGet => {
                return data;
            })
        );
    }

    public submit(post: NextcloudWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/nextcloud_module/wizards/nextcloud.json?angular=true`, post)
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
