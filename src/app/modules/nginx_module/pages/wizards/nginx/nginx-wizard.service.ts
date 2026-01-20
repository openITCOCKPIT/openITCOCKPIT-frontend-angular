import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { NginxWizardGet, NginxWizardPost, } from './nginx-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class NginxWizardService extends WizardsService {

    public fetch(hostId: number): Observable<NginxWizardGet> {
        return this.http.get<NginxWizardGet>(`${this.proxyPath}/nginx_module/wizards/nginx/${hostId}.json?angular=true`).pipe(
            map((data: NginxWizardGet): NginxWizardGet => {
                return data;
            })
        );
    }

    public submit(post: NginxWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/nginx_module/wizards/nginx.json?angular=true`, post)
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
