import { DOCUMENT, inject, Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import { LdapgroupsIndexParams, LdapgroupsIndexRoot } from './ldapgroups.interface';

@Injectable({
    providedIn: 'root',
})
export class LdapgroupsService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    public getIndex(params: LdapgroupsIndexParams): Observable<LdapgroupsIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<LdapgroupsIndexRoot>(`${proxyPath}/ldapgroups/index.json`, {
            params: params as {} // cast CommandsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
