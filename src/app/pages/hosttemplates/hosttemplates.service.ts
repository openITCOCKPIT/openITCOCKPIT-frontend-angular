import { inject, Injectable } from '@angular/core';
import { HosttemplateTypesEnum } from './hosttemplate-types.enum';
import { TranslocoService } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import {
    HosttemplateContainerResult,
    HosttemplateElements,
    HosttemplateIndexRoot,
    HosttemplatesIndexParams,
    HosttemplateTypeResult
} from './hosttemplates.interface';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';


@Injectable({
    providedIn: 'root'
})
export class HosttemplatesService {

    private TranslocoService = inject(TranslocoService);

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }


    /**********************
     *    Index action    *
     **********************/
    public getHosttemplateTypes(): { id: number, name: string }[] {
        return [
            {
                id: HosttemplateTypesEnum.GENERIC_HOSTTEMPLATE,
                name: this.TranslocoService.translate('Generic templates'),
            },
            {
                id: HosttemplateTypesEnum.EVK_HOSTTEMPLATE,
                name: this.TranslocoService.translate('EVC templates'),
            },
        ];
    }

    public getIndex(params: HosttemplatesIndexParams): Observable<HosttemplateIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<HosttemplateIndexRoot>(`${proxyPath}/hosttemplates/index.json`, {
            params: params as {} // cast HosttemplatesIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/hosttemplates/delete/${item.id}.json?angular=true`, {});
    }

    /**********************
     *    Add action    *
     **********************/
    public loadHosttemplateTypes(): Observable<HosttemplateTypeResult[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ types: HosttemplateTypeResult[] }>(`${proxyPath}/hosttemplates/add.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.types
            })
        )
    }

    public loadCommands(): Observable<SelectKeyValue[]> {
        const proxyPath = this.proxyPath;
        return this.http.get<{ commands: SelectKeyValue[] }>(`${proxyPath}/hosttemplates/loadCommands.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.commands
            })
        )
    }

    public loadContainers(): Observable<HosttemplateContainerResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<HosttemplateContainerResult>(`${proxyPath}/hosttemplates/loadContainers.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

    public loadElements(containerId: number): Observable<HosttemplateElements> {
        const proxyPath = this.proxyPath;
        return this.http.get<HosttemplateElements>(`${proxyPath}/hosttemplates/loadElementsByContainerId/${containerId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data
            })
        )
    }

}
