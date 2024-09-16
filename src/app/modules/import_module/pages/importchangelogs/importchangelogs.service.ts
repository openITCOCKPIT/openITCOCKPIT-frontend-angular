import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { ChangelogIndexRoot, ChangelogsIndexParams } from '../../../../pages/changelogs/changelogs.interface';
import { ImportChangelogsEntityParams } from './importchangelogs.interface';

@Injectable({
    providedIn: 'root',
})
export class ImportChangelogsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public getEntity(params: ImportChangelogsEntityParams): Observable<ChangelogIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ChangelogIndexRoot>(`${proxyPath}/import_module/import_changelogs/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getIndex(params: ChangelogsIndexParams): Observable<ChangelogIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ChangelogIndexRoot>(`${proxyPath}/import_module/import_changelogs/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
