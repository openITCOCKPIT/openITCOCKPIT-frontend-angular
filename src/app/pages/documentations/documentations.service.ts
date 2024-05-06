import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { DocumentationView } from './documentations.interface';


@Injectable({
    providedIn: 'root'
})
export class DocumentationsService {

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
    }

    public getView(uuid: string, type: string): Observable<DocumentationView> {
        const proxyPath = this.proxyPath;
        return this.http.get<DocumentationView>(`${proxyPath}/documentations/view/${uuid}/${type}.json`, {
            params: {
                angular: true
            }
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    public save(uuid: string, type: string, content: string): Observable<boolean> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/documentations/view/${uuid}/${type}.json?angular=true`, {
            content: content
        }).pipe(
            map(data => {
                return true;
            })
        );
    }
}
