import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DependencyTreeApiResult } from '../../ExternalSystems.interface';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { Importedhostgroup } from './importedhostgroups.interface';

@Injectable({
  providedIn: 'root'
})
export class ImportedhostgroupsService {

  constructor() { }
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getDependencyTree(hostgroupId: number): Observable<Importedhostgroup> {
        const proxyPath = this.proxyPath;
        return this.http.get<{importedhostgroup:Importedhostgroup}>(`${proxyPath}/import_module/ImportedHostgroups/dependencyTree/${hostgroupId}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data.importedhostgroup;
            })
        );
    }
}
