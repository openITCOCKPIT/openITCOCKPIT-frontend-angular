import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PROXY_PATH } from '../tokens/proxy-path.token';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SystemnameService implements OnDestroy {

    private systemName$$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public systemName$: Observable<string> = this.systemName$$.asObservable();

    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    private readonly AuthService = inject(AuthService);

    private readonly subscriptions: Subscription = new Subscription();

    constructor() {
        this.subscriptions.add(this.AuthService.authenticated$.subscribe((authenticated) => {
            if (authenticated) {
                // User is logged in
                this.loadSystemName();
            }
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private loadSystemName(): void {
        const proxyPath = this.proxyPath;

        this.http.get<{ systenmane: string }>(`${proxyPath}/angular/getSystemname.json`)
            .pipe(
                tap(response => this.systemName$$.next(response.systenmane)),
                take(1)
            )
            .subscribe();
    }
}
