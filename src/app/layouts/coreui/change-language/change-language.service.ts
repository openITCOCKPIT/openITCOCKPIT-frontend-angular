import { inject, Injectable, DOCUMENT } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../../../tokens/proxy-path.token';

import { catchError, map, Observable, of } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class ChangeLanguageService {
    private readonly http = inject(HttpClient);
    private readonly document = inject(DOCUMENT);
    private readonly proxyPath = inject(PROXY_PATH);

    public  changeBackendLanguage(i18n: string): Observable<any> {
        const proxyPath = this.proxyPath;
        return this.http.post<any>(`${proxyPath}/profile/updateI18n.json?angular=true`, {
            i18n: i18n
        }).pipe(
            map(data => {
                return data;
            })
        )
    }
}
