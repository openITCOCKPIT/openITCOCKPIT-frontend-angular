import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { PermissionsService } from '../../permissions/permissions.service';
import { AdditionalHostInformationResult } from './ExternalSystems.interface';

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
    public getAdditionalHostInformation(histId: number): Observable<AdditionalHostInformationResult> {
        const proxyPath = this.proxyPath;
        return this.http.get<AdditionalHostInformationResult>(`${proxyPath}/import_module/ExternalSystems/additionalHostInformation/${histId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

}
