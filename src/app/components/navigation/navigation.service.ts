import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable, Subscription} from "rxjs";
import {Link, NavigationInterface} from "./navigation.interface";
import {AuthService} from "../../auth/auth.service";
import {PROXY_PATH} from "../../tokens/proxy-path.token";
import {INavData} from "@coreui/angular";

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly proxyPath = inject(PROXY_PATH);

  private readonly links$$ = new BehaviorSubject<Link[]>([]);
  public readonly links$ = this.links$$.asObservable();
  private subscriptions: Subscription = new Subscription();

  public constructor() {
    this.subscriptions.add(this.loadMenu()
      .subscribe((result) => {
        this.navigation = this.oitcToCoreUi(result);
      })
    );
  }

  public navigation: INavData[] = []
  public searchResults: INavData[] = []

  private loadMenu(): Observable<NavigationInterface> {
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
    name = name.toLowerCase();
    search = search.toLowerCase();
    return !(name.indexOf(search) === -1);
  }

  public search(searchTerm: string): void {
    this.searchResults = this._search(this.navigation, searchTerm);
  }

  private _search(items: INavData[], searchTerm: string): INavData[] {
    let result: INavData[] = [];

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

  private oitcToCoreUi(navigation: NavigationInterface): INavData[] {
    let ret: INavData[] = [];
    for (let a in navigation.menu) {
      let link: Link = navigation.menu[a];
      let iNavData: INavData = this.oitcToC2(link);
      iNavData.children = [];
      iNavData.title = true;

      ret.push(iNavData);


      for (let itemKey in link.items) {
        let myLink = link.items?.at(parseInt(itemKey)) as Link;
        ret.push(this.oitcToC2(myLink));
      }

    }

    return ret;
  }

  private oitcToC2(link: Link): INavData {
    let iNavData: INavData = {};
    iNavData.name = link.alias || link.name;
    iNavData.children = [];
    iNavData.url = '/' + link.controller + '/' + link.action;

    iNavData.iconComponent = {name: 'cil-puzzle'};

    for (let itemKey in link.items) {
      let myLink = link.items?.at(parseInt(itemKey)) as Link;
      iNavData.children.push(this.oitcToC2(myLink))
    }
    return iNavData;
  }

}
