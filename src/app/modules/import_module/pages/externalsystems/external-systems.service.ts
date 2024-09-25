import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { PermissionsService } from '../../../../permissions/permissions.service';
import {
    AdditionalHostInformationResult,
    Applications,
    DependencyTreeApiResult, ExternalSystemConnect,
    ExternalSystemEntity,
    ExternalSystemPost,
    ExternalSystemsIndexParams,
    ExternalSystemsIndexRoot
} from './external-systems.interface';
import { HostgroupSummaryState, SummaryState } from '../../../../pages/hosts/summary_state.interface';
import { ModalService } from '@coreui/angular';
import {
    GenericIdResponse,
    GenericMessageResponse,
    GenericResponseWrapper,
    GenericValidationError
} from '../../../../generic-responses';
import { DeleteAllItem } from '../../../../layouts/coreui/delete-all-modal/delete-all.interface';

@Injectable({
    providedIn: 'root'
})
export class ExternalSystemsService {
    constructor() {
    }

    public modalExternalSystem$$: Subject<ExternalSystemEntity> = new Subject();
    public modalExternalSystem$ = this.modalExternalSystem$$.asObservable();

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    private readonly PermissionsService = inject(PermissionsService);
    private readonly modalService = inject(ModalService);


    /**********************
     *    Hosts browser    *
     **********************/
    public getAdditionalHostInformation(hostId: number): Observable<AdditionalHostInformationResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<AdditionalHostInformationResult>(`${proxyPath}/import_module/ExternalSystems/additionalHostInformation/${hostId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public getDependencyTree(objectId: number, type: 'host' | 'hostgroup' = 'host'): Observable<DependencyTreeApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<DependencyTreeApiResult>(`${proxyPath}/import_module/ExternalSystems/dependencyTree/${objectId}.json`, {
            params: {
                angular: true,
                type: type
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public getHostSummary(hostId: number): Observable<SummaryState> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            summaryState: SummaryState
        }>(`${proxyPath}/import_module/ExternalSystems/hostsummary/${hostId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.summaryState;
            })
        );
    }

    public getHostgroupSummary(hostgroupId: number): Observable<HostgroupSummaryState> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            summaryState: HostgroupSummaryState
        }>(`${proxyPath}/import_module/ExternalSystems/hostgroupsummary/${hostgroupId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.summaryState;
            })
        );
    }

    public loadExternalSystem(externalSystem: ExternalSystemEntity) {
        if (!externalSystem.id) {
            return;
        }
        switch (externalSystem.system_type) {
            case 'itop':
                // open modal
                this.modalService.toggle({
                    show: true,
                    id: 'importITopData',
                });
                this.loadDataFromITop(externalSystem).subscribe(data => {

                    console.log(data);
                });

                break;
            default:
                console.log('External System not supported yet')
                return;
        }
    }

    public loadDataFromITop(externalSystem: ExternalSystemEntity): Observable<{
        success: boolean;
        data: Applications | GenericMessageResponse;
    }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            applications: Applications
            hasRootPrivileges: boolean
        }>(`${proxyPath}/import_module/imported_hostgroups/loadDataFromITop/${externalSystem.id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                // Return true on 200 Ok
                return {
                    success: true,
                    data: data.applications,
                    hashRootPrivileges: data.hasRootPrivileges
                };
            }),
            catchError((error: any) => {
                let errorMessage: GenericMessageResponse = {message: error.error.response.error};
                return of({
                    success: false,
                    data: errorMessage
                });
            })
        );
    }

    public openImportedHostGroupDataModal(externalSystem: ExternalSystemEntity) {
        this.modalExternalSystem$$.next(externalSystem);

        this.modalService.toggle({
            show: true,
            id: 'importITopData',
        });
    }

    public startDataImport(externalSystem: ExternalSystemEntity, ignoreExternalSystem: boolean = false): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/import_module/imported_hostgroups/importHostgroups/.json?angular=true`, {
            externalSystemId: externalSystem.id,
            ignoreExternalSystem: ignoreExternalSystem
        }).pipe(map(data => {
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

    public getIndex(params: ExternalSystemsIndexParams): Observable<ExternalSystemsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ExternalSystemsIndexRoot>(`${proxyPath}/import_module/external_systems/index.json`, {
            params: params as {} // cast ExternalSystemsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/import_module/external_systems/delete/${item.id}.json?angular=true`, {});
    }

    public testConnection(params: ExternalSystemPost): Observable<ExternalSystemConnect> {
        const proxyPath = this.proxyPath;
        return this.http.post<ExternalSystemConnect>(`${proxyPath}/import_module/external_systems/testConnection.json?angular=true`,
            params // cast ExternalSystemsIndexParams into object
        ).pipe(
            map(data => {
                return data;
            })
        )
    }
}
