import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import { RespositoryCheckerResponse } from './repository-checker.interface';

@Injectable({
    providedIn: 'root'
})
export class RepositoryCheckerService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getRepositoryCheckerData(): Observable<RespositoryCheckerResponse> {
        const proxyPath: string = this.proxyPath;

        return this.http.get<RespositoryCheckerResponse>(`${proxyPath}/packetmanager/repositoryChecker.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map((data: RespositoryCheckerResponse): RespositoryCheckerResponse => {
                return data;
            })
        )
    }

}
