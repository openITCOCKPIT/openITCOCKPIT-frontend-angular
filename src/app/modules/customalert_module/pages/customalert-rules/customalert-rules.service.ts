import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    CustomAlertRule,
    CustomAlertRulesIndex,
    CustomAlertRulesIndexParams,
    EditableCustomAlertRule
} from './customalert-rules.interface';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../generic-responses';

@Injectable({
    providedIn: 'root'
})
export class CustomalertRulesService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getIndex(params: CustomAlertRulesIndexParams): Observable<CustomAlertRulesIndex> {
        return this.http.get<CustomAlertRulesIndex>(`${this.proxyPath}/customalert_module/customalert_rules/index.json`, {
            params: {
                ...params
            }
        }).pipe(
            map((data: CustomAlertRulesIndex): CustomAlertRulesIndex => {
                return data;
            })
        );
    }

    public delete(item: DeleteAllItem): Observable<Object> {
        return this.http.post(`${this.proxyPath}/customalert_module/customalert_rules/delete/${item.id}.json`, {});
    }

    public add(customAlertRule: CustomAlertRule): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/customalert_module/customalert_rules/add.json?angular=true`, customAlertRule)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
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

    public getEdit(id: number): Observable<EditableCustomAlertRule> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ customalertRule: EditableCustomAlertRule }>(`${proxyPath}/customalert_module/customalert_rules/edit/${id}.json?angular=true`, {}).pipe(
            map(data => {
                return data.customalertRule;
            })
        )
    }

    public update(customAlertRule: EditableCustomAlertRule): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/customalert_module/customalert_rules/edit/${customAlertRule.id}.json?angular=true`, customAlertRule)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as GenericIdResponse
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