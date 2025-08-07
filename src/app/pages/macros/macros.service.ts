import { inject, Injectable, DOCUMENT } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import { AvailableMacroNamesParams, MacroIndex, MacroIndexRoot, MacroPost } from './macros.interface';
import { GenericSuccessResponse, GenericValidationError } from '../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class MacrosService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(): Observable<MacroIndex[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<MacroIndexRoot>(`${proxyPath}/macros/index.json`, {
            params: {
                angular: 'true',
            }
        }).pipe(
            map(data => {
                return data.all_macros;
            })
        )
    }

    public getAvailableMacroNames(params: AvailableMacroNamesParams): Observable<string[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ availableMacroNames: string[] }>(`${proxyPath}/macros/getAvailableMacroNames.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data.availableMacroNames;
            })
        )
    }


    public addMacro(macro: MacroPost): Observable<boolean | GenericValidationError> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/macros/add.json?angular=true`, macro)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return true;
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of(err);
                })
            );
    }

    public editMacro(macro: MacroPost): Observable<boolean | GenericValidationError> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/macros/edit/${macro.Macro.id}.json?angular=true`, macro)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return true;
                }),
                catchError((error: any) => {
                    const err = error.error.error as GenericValidationError;
                    return of(err);
                })
            );
    }

    public deleteMacro(id: number): Observable<GenericSuccessResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<GenericSuccessResponse>(`${proxyPath}/macros/delete/${id}.json?angular=true`, {})
            .pipe(
                map(data => {
                    return data;
                }),
                catchError((error: any) => {
                    console.error(error.error);
                    const err: GenericSuccessResponse = {
                        success: false
                    }
                    return of(err);
                })
            );
    }
}
