
import { inject, Injectable} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { switchMap, Observable, map} from "rxjs";
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import { ChartjsGraphInterface, PerfParams} from "./chartjs-graph.interface";

@Injectable({
  providedIn: 'root'
})
export class ChartjsGraphService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);
  constructor() { }
    public getPerfdata(params: PerfParams): Observable<ChartjsGraphInterface> {
        const proxyPath = this.proxyPath;

        return this.http.get<ChartjsGraphInterface>(`${proxyPath}/Graphgenerators/getPerfdataByUuid.json`, {
            params: params as {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
