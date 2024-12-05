import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../../../../../pages/wizards/wizards.service';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { Db2WizardGet, Db2WizardPost } from './db2-wizard.interface';

@Injectable({
    providedIn: 'root'
})
export class Db2WizardService extends WizardsService {

    public fetch(hostId: number): Observable<Db2WizardGet> {
        return this.http.get<Db2WizardGet>(`${this.proxyPath}/db2_module/wizards/db2/${hostId}.json?angular=true`).pipe(
            map((data: Db2WizardGet): Db2WizardGet => {
                return data;
            })
        );
    }

    public submit(post: Db2WizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/db2_module/wizards/db2.json?angular=true`, post)
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