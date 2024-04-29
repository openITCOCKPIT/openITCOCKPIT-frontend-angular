import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, map, Observable } from "rxjs";
import { MenuLink, NavigationInterface } from "./navigation.interface";
import { AuthService } from "../../auth/auth.service";
import { PROXY_PATH } from "../../tokens/proxy-path.token";

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private readonly http = inject(HttpClient);
    private readonly authService = inject(AuthService);
    private readonly proxyPath = inject(PROXY_PATH);

    private readonly links$$ = new BehaviorSubject<MenuLink[]>([]);


    public loadMenu(): Observable<NavigationInterface> {
        const proxyPath = this.proxyPath;
        return this.http.get<NavigationInterface>(`${proxyPath}/angular/menu.json`, {
            params: {}
        }).pipe(
            map(data => {
                return data;
            })
        )
    }

}
