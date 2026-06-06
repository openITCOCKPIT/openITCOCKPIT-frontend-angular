import { inject, Injectable, DOCUMENT } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import { ChangelogIndexRoot, ChangelogsEntityParams, ChangelogsIndexParams } from './changelogs.interface';

@Injectable({
    providedIn: 'root',
})
export class ChangelogsService {

    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    public getEntity(params: ChangelogsEntityParams): Observable<ChangelogIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ChangelogIndexRoot>(`${proxyPath}/changelogs/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getIndex(params: ChangelogsIndexParams): Observable<ChangelogIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ChangelogIndexRoot>(`${proxyPath}/changelogs/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
