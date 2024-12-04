import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { LoadHostsByStringRoot, WizardPost, WizardRoot, WizardsIndex } from './wizards.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class WizardsService {

    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(): Observable<WizardsIndex> {
        return this.http.get<WizardsIndex>(`${this.proxyPath}/wizards/index.json?angular=true`).pipe(
            map((data: WizardsIndex): WizardsIndex => {
                return data;
            })
        );
    }

    public loadHostsByString(search: string = ''): Observable<SelectKeyValue[]> {
        return this.http.get<LoadHostsByStringRoot>(`${this.proxyPath}/wizards/loadHostsByString.json?angular=true`).pipe(
            map((data: LoadHostsByStringRoot): SelectKeyValue[] => {
                return data.hosts;
            })
        );
    }

    public getMysqlWizard(hostId: number): Observable<WizardRoot> {
        return this.http.get<WizardRoot>(`${this.proxyPath}/wizards/mysqlserver/${hostId}.json?angular=true`).pipe(
            map((data: WizardRoot): WizardRoot => {
                return data;
            })
        );
    }

    public postMysqlWizard(post: WizardPost): Observable<GenericResponseWrapper> {
        return this.http.post<any>(`${this.proxyPath}/wizards/mysqlserver.json?angular=true`, post)
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: 342
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