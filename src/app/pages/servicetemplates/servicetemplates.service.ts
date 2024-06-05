import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { TranslocoService } from '@jsverse/transloco';
import { ServicetemplateTypesEnum } from './servicetemplate-types.enum';
import { PermissionsService } from '../../permissions/permissions.service';
import { ServicetemplateIndexRoot, ServicetemplatesIndexParams } from './servicetemplates.interface';


@Injectable({
    providedIn: 'root'
})
export class ServicetemplatesService {

    private TranslocoService = inject(TranslocoService);
    private PermissionsService = inject(PermissionsService);

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }


    /**********************
     *    Index action    *
     **********************/
    public getServicetemplateTypes(): { id: number, name: string }[] {
        let types = [
            {
                id: ServicetemplateTypesEnum.GENERIC_SERVICE,
                name: this.TranslocoService.translate('Generic templates'),
            },
            {
                id: ServicetemplateTypesEnum.OITC_AGENT_SERVICE,
                name: this.TranslocoService.translate('Agent templates'),
            },
        ];

        this.PermissionsService.hasModuleObservable('EventcorrelationModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: ServicetemplateTypesEnum.EVK_SERVICE,
                    name: this.TranslocoService.translate('EVC templates'),
                });
            }
        });

        this.PermissionsService.hasModuleObservable('CheckmkModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: ServicetemplateTypesEnum.MK_SERVICE,
                    name: this.TranslocoService.translate('Checkmk templates'),
                });
            }
        });

        this.PermissionsService.hasModuleObservable('PrometheusModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: ServicetemplateTypesEnum.PROMETHEUS_SERVICE,
                    name: this.TranslocoService.translate('Prometheus templates'),
                });
            }
        });

        this.PermissionsService.hasModuleObservable('ImportModule').subscribe(hasModule => {
            if (hasModule) {
                types.push({
                    id: ServicetemplateTypesEnum.EXTERNAL_SERVICE,
                    name: this.TranslocoService.translate('External templates'),
                });
            }
        });

        return types;
    }

    public getIndex(params: ServicetemplatesIndexParams): Observable<ServicetemplateIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicetemplateIndexRoot>(`${proxyPath}/servicetemplates/index.json`, {
            params: params as {} // cast ServicetemplatesIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    // Generic function for the Delete All Modal
    public delete(item: DeleteAllItem): Observable<Object> {
        const proxyPath = this.proxyPath;
        return this.http.post(`${proxyPath}/servicetemplates/delete/${item.id}.json?angular=true`, {});
    }
}
