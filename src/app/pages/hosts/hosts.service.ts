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
    HostDnsLookup,
    HostElements,
    HostPost,
    HostSharing,
    HostsIndexFilter,
    HostsIndexParams,
    HostsIndexRoot
} from './hosts.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';
import { HosttemplatePost } from '../hosttemplates/hosttemplates.interface';


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

    public loadElements(containerId: number): Observable<HostElements> {
        const proxyPath = this.proxyPath;
        return this.http.get<HostElements>(`${proxyPath}/hosts/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadCommandArguments(commandId: number): Observable<HostCommandArgument[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{
            hostcommandargumentvalues: HostCommandArgument[]
        }>(`${proxyPath}/hosts/loadCommandArguments/${commandId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.hostcommandargumentvalues;
            })
        );
    }

    public checkForDuplicateHostname(hostname: string): Observable<boolean> {
        const proxyPath = this.proxyPath;
        return this.http.post<{
            isHostnameInUse: boolean
        }>(`${proxyPath}/hosts/checkForDuplicateHostname.json?angular=true`, {
            hostname: hostname
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

    public loadParentHosts(searchString: string, containerId: number, selected: number[] = [], satellite_id: number | string = ''): Observable<SelectKeyValue[]> {
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
                'satellite_id': satellite_id
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

}
