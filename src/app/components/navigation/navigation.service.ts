import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, filter, take, switchMap} from "rxjs";
import {Link, NavigationInterface} from "./navigation.interface";
import {AuthService} from "../../auth/auth.service";
import {PROXY_PATH} from "../../tokens/proxy-path.token";

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private readonly http = inject(HttpClient);
    private readonly authService = inject(AuthService);
    private readonly proxyPath = inject(PROXY_PATH);

    private readonly links$$ = new BehaviorSubject<Link[]>([]);

    public constructor() {
        this.loadMenu();
    }

    private loadMenu(): void {
        const proxyPath = this.proxyPath;

        this.authService.authenticated$.pipe(
            filter(authenticated => authenticated),
            take(1),
            switchMap(() => this.http.get<NavigationInterface>(`${proxyPath}/angular/menu.json`)),
        ).subscribe({
            next: navigation => {
                this.links$$.next(navigation.menu);
                console.warn(this.links$$.getValue());
            },
        });
    }

    public getLinkSubject():BehaviorSubject<Link[]> {
        return this.links$$;
    }

}
