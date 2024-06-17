import { inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";
import {PROXY_PATH} from "../../../tokens/proxy-path.token";
import { ServicesIndexRoot, ServiceParams, Usertimezone } from "../services.interface";
import { DisableItem, DisableModalService } from '../../../layouts/coreui/disable-modal/disable.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { DeleteAllItem, DeleteAllModalService } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { MaintenanceModal } from '../../../components/services/service-maintenance-modal/service-maintenance.interface';


@Injectable({
    providedIn: 'root',
})
export class ServicesIndexService implements DisableModalService, DeleteAllModalService, MaintenanceModal {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);


    public getServicesIndex (params: ServiceParams): Observable<ServicesIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicesIndexRoot>(`${proxyPath}/services/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public setExternalCommands (params: any): Observable<any> {
        const proxyPath = this.proxyPath;
        // @ts-ignore
        return this.http.post<any>(`${proxyPath}/nagios_module/cmd/submit_bulk_naemon.json`,
            params)
            .pipe(map(result => {
                    return result
                }),
                catchError((error: any) => {
                    return 'e';
                })
            )
    }

    public geDowntimeDefaults (): Observable<any> {
        const proxyPath = this.proxyPath;

        return this.http.get<any>(`${proxyPath}/angular/getDowntimeData.json`,
            {
                params:  {angular: true}
            })
            .pipe(map(result => {
                    return result
                }),
                catchError((error: any) => {
                    return 'e';
                })
            )
    }

    public validateDowntimeInput(forminput: any): Observable<GenericResponseWrapper>{
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/downtimes/validateDowntimeInputFromAngular.json?angular=true`, forminput).pipe(
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

    public disable (item: DisableItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/services/deactivate/${item.id}.json?angular=true`, {});
    }

    // @ts-ignore
    public delete () {}


    public getUserTimezone (): Observable<Usertimezone> {
        const proxyPath = this.proxyPath;

        return this.http.get<Usertimezone>(`${proxyPath}/angular/user_timezone.json`, {
            params: {angular: true}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}