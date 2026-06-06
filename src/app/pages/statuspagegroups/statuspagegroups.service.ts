import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { catchError, map, Observable, of } from 'rxjs';
import {
    StatupagegroupViewDetailsRoot,
    StatupagegroupViewRoot,
    StatuspagegroupPost,
    StatuspagegroupsIndex,
    StatuspagegroupsIndexParams
} from './statuspagegroups.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import {
    StatuspagegroupsLoadStatuspagegroupsByStringParams
} from '../dashboards/widgets/statuspagegroup-widget/statuspagegroup-widget.interface';

@Injectable({
    providedIn: 'root'
})
export class StatuspagegroupsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getStatuspagegroups(params: StatuspagegroupsIndexParams): Observable<StatuspagegroupsIndex> {
        const proxyPath = this.proxyPath;
        return this.http.get<StatuspagegroupsIndex>(`${proxyPath}/statuspagegroups/index.json`, {
            params: params as {} // cast StatuspagegroupsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public loadStatuspagegroupsByString(params: StatuspagegroupsLoadStatuspagegroupsByStringParams): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;

        return this.http.get<{
            statuspagegroups: SelectKeyValue[]
        }>(`${proxyPath}/statuspagegroups/loadStatuspagegroupsByString.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data.statuspagegroups;
            })
        );
    }

    public add(statuspagegroup: StatuspagegroupPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/statuspagegroups/add.json`, statuspagegroup)
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

    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/statuspagegroups/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers
            })
        )
    }

    public getStatuspagegroupEdit(id: number): Observable<StatuspagegroupPost> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            statuspagegroup: StatuspagegroupPost
        }>(`${proxyPath}/statuspagegroups/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.statuspagegroup;
            })
        );
    }

    /**
     * editStepTwo has access to:
     *     $statuspagegroup->setAccess('statuspages_membership', false);
     *     $statuspagegroup->setAccess('statuspagegroup_collections', true);
     *     $statuspagegroup->setAccess('statuspagegroup_categories', true);
     * @param statuspagegroup
     */
    public saveStatuspagegroupEdit(statuspagegroup: StatuspagegroupPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/statuspagegroups/edit/${statuspagegroup.id}.json`, statuspagegroup)
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

    public getStatuspagegroupEditStepTwo(id: number): Observable<{
        statuspagegroup: StatuspagegroupPost,
        statuspages: SelectKeyValue[]
    }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            statuspagegroup: StatuspagegroupPost,
            statuspages: SelectKeyValue[]
        }>(`${proxyPath}/statuspagegroups/editStepTwo/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    /**
     * editStepTwo has access to:
     *     $statuspagegroup->setAccess('statuspages_membership', true);
     *     $statuspagegroup->setAccess('statuspagegroup_collections', false);
     *     $statuspagegroup->setAccess('statuspagegroup_categories', false);
     * @param statuspagegroup
     */
    public saveStatuspagegroupEditStepTwo(statuspagegroup: StatuspagegroupPost): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/statuspagegroups/editStepTwo/${statuspagegroup.id}.json`, statuspagegroup)
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

    /**********************
     *    Delete action    *
     **********************/
    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/statuspagegroups/delete/${item.id}.json?angular=true`, {});
    }

    /**********************
     *     View action    *
     **********************/
    public getStatuspagegroupView(id: number): Observable<StatupagegroupViewRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<StatupagegroupViewRoot>(`${proxyPath}/statuspagegroups/view/${id}.json`, {}).pipe(
            map(data => {
                return data;
            })
        );
    }

    public getStatuspagegroupGetDetails(id: number): Observable<StatupagegroupViewDetailsRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<StatupagegroupViewDetailsRoot>(`${proxyPath}/statuspagegroups/getDetails/${id}.json`, {}).pipe(
            map(data => {
                return data;
            })
        );
    }
}
