import { inject, Injectable} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map} from "rxjs";
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import { ServicesBrowser } from "./services.interface";
import { Usertimezone } from "./timezone.interface";

@Injectable({
    providedIn: 'root',
})
export class ServicesbrowserService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);


    public getServicesbrowser(): Observable<ServicesBrowser> {
        const proxyPath = this.proxyPath;
        //3,12, 20, 103
        return this.http.get<ServicesBrowser>(`${proxyPath}/services/browser/12.json`, {
            params: {angular: true}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

    public getUserTimezone(): Observable<Usertimezone> {
        const proxyPath = this.proxyPath;

        return this.http.get<Usertimezone>(`${proxyPath}/angular/user_timezone.json`, {
            params: {angular: true}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}