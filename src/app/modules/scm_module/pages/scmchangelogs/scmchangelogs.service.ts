import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { ChangelogIndexRoot, ChangelogsIndexParams } from '../../../../pages/changelogs/changelogs.interface';
import { ScmChangelogsEntityParams } from './scmchangelogs.interface';

@Injectable({
    providedIn: 'root',
})
export class ScmchangelogsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getEntity(params: ScmChangelogsEntityParams): Observable<ChangelogIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ChangelogIndexRoot>(`${proxyPath}/scm_module/scm_changelogs/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getIndex(params: ChangelogsIndexParams): Observable<ChangelogIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ChangelogIndexRoot>(`${proxyPath}/scm_module/scm_changelogs/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
