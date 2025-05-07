import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    LoadHostsByStringRoot,
    ValidateInputFromAngularPost,
    WizardAssignments,
    WizardGet,
    WizardGetAssignments,
    WizardPost,
    WizardsIndex
} from './wizards.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export abstract class WizardsService {

    protected readonly http: HttpClient = inject(HttpClient);
    protected readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(): Observable<WizardsIndex> {
        return this.http.get<WizardsIndex>(`${this.proxyPath}/wizards/index.json?angular=true`).pipe(
            map((data: WizardsIndex): WizardsIndex => {
                return data;
            })
        );
    }

    public validateInput(post: ValidateInputFromAngularPost): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/wizards/validateInputFromAngular.json?angular=true`, post)
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

    public loadHostsByString(name: string, typeId: string = ''): Observable<SelectKeyValue[]> {
        return this.http.get<LoadHostsByStringRoot>(`${this.proxyPath}/wizards/loadHostsByString.json?angular=true`, {
            params: {
                'filter[Hosts.name]': name,
                typeId: typeId
            }
        }).pipe(
            map((data: LoadHostsByStringRoot): SelectKeyValue[] => {
                return data.hosts;
            })
        );
    }

    public getAssignments(uuid: string): Observable<WizardGetAssignments> {
        return this.http.get<WizardGetAssignments>(`${this.proxyPath}/wizards/edit/${uuid}.json?angular=true`).pipe(
            map((data: WizardGetAssignments): WizardGetAssignments => {
                return data;
            })
        );
    }

    public setAssignments(post: WizardAssignments): Observable<GenericResponseWrapper> {
        const proxyPath: string = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/wizards/edit/${post.uuid}.json?angular=true`, post)
            .pipe(
                map(data => {
                    return {
                        success: true,
                        data: data.user as GenericIdResponse
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

    abstract fetch(hostId: number): Observable<WizardGet>;

    abstract submit(post: WizardPost): Observable<GenericResponseWrapper>;
}