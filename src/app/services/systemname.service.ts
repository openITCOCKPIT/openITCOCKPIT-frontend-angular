import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../tokens/proxy-path.token';

@Injectable({
    providedIn: 'root'
})
export class SystemnameService {

    private systemName$$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public systemName$: Observable<string> = this.systemName$$.asObservable();

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    constructor() {
        this.loadSystemName();
    }

    private loadSystemName(): void {
        const proxyPath = this.proxyPath;

        this.http.get<{ systenmane: string }>(`${proxyPath}/angular/getSystemname.json`)
            .pipe(
                tap(response => this.systemName$$.next(response.systenmane))
            )
            .subscribe();
    }
}
