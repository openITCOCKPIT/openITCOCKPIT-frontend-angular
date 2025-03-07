import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../../tokens/proxy-path.token';
import { map, Observable } from 'rxjs';
import { DesignsEditRoot, ResetLogoResponse } from './designs.interface';

@Injectable({
    providedIn: 'root'
})
export class DesignsService {
    private readonly http: HttpClient = inject(HttpClient);
    private readonly proxyPath: string = inject(PROXY_PATH);

    public getEdit(): Observable<DesignsEditRoot> {
        const proxyPath = this.proxyPath;
        return this.http.get<DesignsEditRoot>(`${proxyPath}/design_module/designs/edit.json?angular=true`).pipe(
            map(data => {
                return data;
            })
        )
    }

    public resetLogo(type: number): Observable<ResetLogoResponse> {
        const proxyPath = this.proxyPath;
        return this.http.get<ResetLogoResponse>(`${proxyPath}/design_module/uploads/resetLogo.json`, {
            params: {
                angular: 'true',
                type: type
            }
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
