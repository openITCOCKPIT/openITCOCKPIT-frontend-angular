import { inject, Injectable } from '@angular/core';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { HostTypesEnum } from './hosts.enum';
import { PermissionsService } from '../../permissions/permissions.service';
import { TranslocoService } from '@jsverse/transloco';
import { HostSharing, HostsIndexFilter, HostsIndexParams, HostsIndexRoot } from './hosts.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../generic-responses';


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
}
