import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { WizardsService } from '../wizards.service';
import { MysqlWizardGet, MysqlWizardPost } from './mysqlserver-wizard.interface';
import { GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class MysqlserverWizardService extends WizardsService {

    public fetch(hostId: number): Observable<MysqlWizardGet> {
        return this.http.get<MysqlWizardGet>(`${this.proxyPath}/wizards/mysqlserver/${hostId}.json?angular=true`).pipe(
            map((data: MysqlWizardGet): MysqlWizardGet => {
                return data;
            })
        );
    }

    public submit(post: MysqlWizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/wizards/mysqlserver.json?angular=true`, post)
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