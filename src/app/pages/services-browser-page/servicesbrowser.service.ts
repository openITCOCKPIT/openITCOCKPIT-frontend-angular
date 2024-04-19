import { inject, Injectable} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { switchMap, Observable, map} from "rxjs";
import { PROXY_PATH } from "../tokens/proxy-path.token";
import { ServiceIndex, ServicesIndexParams } from "./services.interface";

@Injectable({
    providedIn: 'root',
})
export class ServicesService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    public getServicesIndex(params: ServicesIndexParams): Observable<ServiceIndex[]> {
        const proxyPath = this.proxyPath;

        return this.http.get<ServiceIndex[]>(`${proxyPath}/index.php/services`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}