import { inject, Injectable } from '@angular/core';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { HostTypesEnum } from './hosts.enum';
import { PermissionsService } from '../../permissions/permissions.service';
import { TranslocoService } from '@jsverse/transloco';
import {
    HostAddEditSuccessResponse,
    HostCommandArgument,
    HostCopyGet,
    HostCopyPost,
    HostDnsLookup,
    HostEditApiResult,
    HostElements,
    HostPost,
    HostsDisabledParams,
    HostsDisabledRoot,
    HostSharing,
    HostsIndexFilter,
    HostsIndexParams,
    HostsIndexRoot,
    HostsLoadHostsByStringParams,
    HostsNotMonitoredParams,
    HostUsedByRoot
} from './hosts.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { HosttemplatePost } from '../hosttemplates/hosttemplates.interface';
import { EnableItem } from '../../layouts/coreui/enable-modal/enable.interface';
import { DisableItem } from '../../layouts/coreui/disable-modal/disable.interface';


@Injectable({
    providedIn: 'root'
})
export class HostsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    private TranslocoService = inject(TranslocoService);
    private PermissionsService = inject(PermissionsService);

    constructor() {
    }


    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;

        return this.http.post(`${proxyPath}/hosts/delete/${item.id}.json`, {});
    }

    /**********************
     *    Index action    *
     **********************/
    public getHostTypes(): { id: number, name: string }[] {
        let types = [
            {
                id: HostTypesEnum.GENERIC_HOST,
                name: this.TranslocoService.translate('Generic host'),
            }
        ];

        this.PermissionsService.hasModuleObservable('EventcorrelationModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: HostTypesEnum.EVK_HOST,
                    name: this.TranslocoService.translate('EVC host'),
                });
            }
        });

        return types;
    }

    public getIndex(params: HostsIndexParams, filter: HostsIndexFilter): Observable<HostsIndexRoot> {
        const proxyPath = this.proxyPath;
        // ITC-2599 Change load function to use POST
        return this.http.post<HostsIndexRoot>(`${proxyPath}/hosts/index.json`, {
            filter: filter as {} // POST data used for filter
        }, {
            params: params as {} // query string parameter
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public getSatellites(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ satellites: SelectKeyValue[] }>(`${proxyPath}/angular/getSatellites.json`).pipe(
            map(data => {
                return data.satellites
            })
        );
    }

    public disable(item: DisableItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/hosts/deactivate/${item.id}.json?angular=true`, {});
    }

    /**********************
     *    Sharing action    *
     **********************/
    public getSharing(id: number): Observable<{
        host: HostSharing,
        primaryContainerPathSelect: SelectKeyValue[],
        sharingContainers: SelectKeyValue[]
    }> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            host: HostSharing,
            primaryContainerPathSelect: SelectKeyValue[],
            sharingContainers: SelectKeyValue[]
        }>(`${proxyPath}/hosts/sharing/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return {
                    host: data.host,
                    primaryContainerPathSelect: data.primaryContainerPathSelect,
                    sharingContainers: data.sharingContainers
                };
            })
        );
    }

    public updateSharing(host: HostSharing): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/hosts/sharing/${host.Host.id}.json?angular=true`, {
            Host: {
                id: host.Host.id,
                hosts_to_containers_sharing: {
                    _ids: host.Host.hosts_to_containers_sharing._ids
                }
            }
        })
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
     *    Add action    *
     **********************/
    public loadCommands(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ commands: SelectKeyValue[] }>(`${proxyPath}/hosts/loadCommands.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.commands
            })
        )
    }

    public loadContainers(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ containers: SelectKeyValue[] }>(`${proxyPath}/hosts/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.containers
            })
        )
    }

    public loadElements(containerId: number, hostId: number = 0): Observable<HostElements> {
        const proxyPath = this.proxyPath;
        let url = `${proxyPath}/hosts/loadElementsByContainerId/${containerId}.json`;

        if (hostId) {
            url = `${proxyPath}/hosts/loadElementsByContainerId/${containerId}/${hostId}.json`
        }

        return this.http.get<HostElements>(url, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadCommandArguments(commandId: number, hostId: number = 0): Observable<HostCommandArgument[]> {
        const proxyPath = this.proxyPath;

        let url = `${proxyPath}/hosts/loadCommandArguments/${commandId}.json`;
        if (hostId > 0) {
            url = `${proxyPath}/hosts/loadCommandArguments/${commandId}/${hostId}.json`
        }

        return this.http.get<{
            hostcommandargumentvalues: HostCommandArgument[]
        }>(url, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.hostcommandargumentvalues;
            })
        );
    }

    public checkForDuplicateHostname(hostname: string, excludedHostIds: number[] = []): Observable<boolean> {
        const proxyPath = this.proxyPath;
        return this.http.post<{
            isHostnameInUse: boolean
        }>(`${proxyPath}/hosts/checkForDuplicateHostname.json?angular=true`, {
            hostname: hostname,
            excludedHostIds: excludedHostIds
        }).pipe(
            map(data => {
                return data.isHostnameInUse;
            })
        );
    }

    public runDnsLookup(data: HostDnsLookup): Observable<HostDnsLookup> {
        const proxyPath = this.proxyPath;
        return this.http.post<{
            result: HostDnsLookup
        }>(`${proxyPath}/hosts/runDnsLookup.json?angular=true`, {
            address: data.address,
            hostname: data.hostname

        }).pipe(
            map(data => {
                return data.result;
            })
        );
    }

    public loadParentHosts(searchString: string, containerId: number, selected: number[] = [], satellite_id: number): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;

        if (!containerId) {
            return of([]); // No container selected
        }

        return this.http.get<{
            hosts: SelectKeyValue[]
        }>(`${proxyPath}/hosts/loadParentHostsByString.json`, {
            params: {
                'angular': true,
                'filter[Hosts.name]': searchString,
                'selected[]': selected,
                'containerId': containerId,
                'satellite_id': (satellite_id > 0) ? satellite_id : ''
            }
        }).pipe(
            map(data => {
                return data.hosts;
            })
        );
    }

    public loadHosttemplate(hosttemplateId: number): Observable<HosttemplatePost> {
        const proxyPath = this.proxyPath;


        return this.http.get<{
            hosttemplate: { Hosttemplate: HosttemplatePost }
        }>(`${proxyPath}/hosts/loadHosttemplate/${hosttemplateId}.json`, {
            params: {
                'angular': true
            }
        }).pipe(
            map(data => {
                return data.hosttemplate.Hosttemplate;
            })
        );
    }

    public add(host: HostPost, save_host_and_assign_matching_servicetemplate_groups = false): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        let body: any = {
            Host: host
        };
        if (save_host_and_assign_matching_servicetemplate_groups) {
            body['save_host_and_assign_matching_servicetemplate_groups'] = true;
        }

        return this.http.post<any>(`${proxyPath}/hosts/add.json?angular=true`, body)
            .pipe(
                map(data => {
                    // Return true on 200 Ok
                    return {
                        success: true,
                        data: data as HostAddEditSuccessResponse
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
     *    Edit action    *
     **********************/


    public edit(host: HostPost, save_host_and_assign_matching_servicetemplate_groups = false): Observable<GenericResponseWrapper> {
        const proxyPath = this.proxyPath;

        let body: any = {
            Host: host
        };
        if (save_host_and_assign_matching_servicetemplate_groups) {
            body['save_host_and_assign_matching_servicetemplate_groups'] = true;
        }

        return this.http.post<any>(`${proxyPath}/hosts/edit/${host.id}.json?angular=true`, body)
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

    public getEdit(id: number): Observable<HostEditApiResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostEditApiResult>(`${proxyPath}/hosts/edit/${id}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    /**********************
     *    Copy action    *
     **********************/

    public getHostsCopy(ids: number[]): Observable<HostCopyGet[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ hosts: HostCopyGet[] }>(`${proxyPath}/hosts/copy/${ids.join('/')}.json?angular=true`)
            .pipe(
                map(data => {
                    return data.hosts;
                })
            )
    }

    public saveHostsCopy(hosts: HostCopyPost[]): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/hosts/copy/.json?angular=true`, {
            data: hosts
        });
    }

    /**********************
     *    Global action    *
     **********************/

    public loadHostsByString(params: HostsLoadHostsByStringParams, onlyHostsWithWritePermission: boolean = false): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;

        let url = `${proxyPath}/hosts/loadHostsByString.json`;
        if (onlyHostsWithWritePermission) {
            url = `${proxyPath}/hosts/loadHostsByString/1.json`;
        }

        return this.http.get<{ hosts: SelectKeyValue[] }>(url, {
            params: params as {}
        }).pipe(
            map(data => {
                return data.hosts;
            })
        );
    }

    /**********************
     *    Hosts Disabled  *
     **********************/

    public getHostsDisabled(params: HostsDisabledParams): Observable<HostsDisabledRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostsDisabledRoot>(`${proxyPath}/hosts/disabled.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public enable(item: EnableItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/hosts/enable/${item.id}.json?`, {
            empty: true // ??
        });
    }

    /***************************
     *    Hosts Not Monitored  *
     ***************************/

    public getNotMonitored(params: HostsNotMonitoredParams): Observable<HostsDisabledRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostsDisabledRoot>(`${proxyPath}/hosts/notMonitored.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    /**********************
     *   Used By action   *
     **********************/
    public usedBy(id: number): Observable<HostUsedByRoot> {
        const proxyPath = this.proxyPath;
        return this
            .http.get<HostUsedByRoot>(`${proxyPath}/hosts/usedBy/${id}.json?angular=true`)
            .pipe(
                map(data => {
                    return data;
                })
            )
    }


}
