import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, map, Observable, Subscription } from "rxjs";
import { MenuLink, NavigationInterface } from "./navigation.interface";
import { AuthService } from "../../auth/auth.service";
import { PROXY_PATH } from "../../tokens/proxy-path.token";
import { INavData } from "@coreui/angular";

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private readonly http = inject(HttpClient);
    private readonly authService = inject(AuthService);
    private readonly proxyPath = inject(PROXY_PATH);

    private readonly links$$ = new BehaviorSubject<MenuLink[]>([]);
    public readonly links$ = this.links$$.asObservable();
    private subscriptions: Subscription = new Subscription();

    //todo remove
// public constructor() {
//     this.subscriptions.add(this.loadMenu()
//         .subscribe((result) => {
//             this.navigation = this.oitcToCoreUi(result);
//         })
//     );
// }

    public navigation: INavData[] = []
    public searchResults: INavData[] = []

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

    public navEntryMatchesSearch(navigationElement: INavData, search: string): boolean {
        let name: string = navigationElement.name as string;
        if (typeof (navigationElement.url) !== "string") {
            return false;
        }
        name = name.toLowerCase();
        search = search.toLowerCase();
        return !(name.indexOf(search) === -1);
    }

    public search(searchTerm: string): void {
        const results = this._search(this.navigation, searchTerm);
        console.log(results);
        this.searchResults = results;
    }

    private _search(items: INavData[], searchTerm: string): INavData[] {
        let result: INavData[] = [];

        if (searchTerm.length === 0) {
            return result;
        }

        for (let key in items) {
            let item = items[key];
            item.children = item.children as INavData[];
            // First level?
            if (this.navEntryMatchesSearch(item, searchTerm)) {
                result.push(item);
            }

            if (item.children.length === 0) {
                continue;
            }
            let foundChildren: INavData[] = this._search(item.children as INavData[], searchTerm);
            for (let foundChildrenIndex in foundChildren) {
                let foundChild = foundChildren[foundChildrenIndex];
                result.push(foundChild);

            }
        }
        return result;
    }


}
