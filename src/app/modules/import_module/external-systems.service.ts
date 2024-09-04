import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { PermissionsService } from '../../permissions/permissions.service';
import { AdditionalHostInformationResult, DependencyTreeApiResult } from './ExternalSystems.interface';
import { HostgroupSummaryState, SummaryState } from '../../pages/hosts/summary_state.interface';

@Injectable({
    providedIn: 'root'
})
export class ExternalSystemsService {

    constructor() {
    }

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    private readonly PermissionsService = inject(PermissionsService);

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

}
