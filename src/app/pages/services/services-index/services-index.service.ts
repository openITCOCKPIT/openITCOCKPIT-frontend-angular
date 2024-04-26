import { inject, Injectable} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map} from "rxjs";
import { PROXY_PATH } from "../../../tokens/proxy-path.token";
import { ServicesIndexRoot, ServiceParams } from   "./services.interface"


@Injectable({
    providedIn: 'root',
})
export class ServicesIndexService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);


    public getServicesIndex(params: ServiceParams): Observable<ServicesIndexRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<ServicesIndexRoot>(`${proxyPath}/services/index.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

  /*  public getUserTimezone(): Observable<Usertimezone> {
        const proxyPath = this.proxyPath;

        return this.http.get<Usertimezone>(`${proxyPath}/angular/user_timezone.json`, {
            params: {angular: true}
        }).pipe(
            map(data => {
                return data;
            })
        )
    } */

}