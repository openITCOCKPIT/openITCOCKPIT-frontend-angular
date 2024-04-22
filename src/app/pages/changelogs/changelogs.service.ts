import { inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
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

    public getIndex(params: ChangelogsEntityParams): Observable<ChangelogIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ChangelogIndexRoot>(`${proxyPath}/changelogs/index.json`, {
            params: params as {} // cast CommandsIndexParams into object
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
