
import { inject, Injectable} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { PROXY_PATH } from "../../tokens/proxy-path.token";


@Injectable({
  providedIn: 'root'
})
export class AckTooltipService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);
  constructor() { }
    public getData(url: any): Observable<any> {
        const proxyPath = this.proxyPath;
        return this.http.get<any>(`${proxyPath}/${url}`, {
            params: {angular:true}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
