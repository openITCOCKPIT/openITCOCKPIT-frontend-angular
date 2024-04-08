import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, filter, take, switchMap} from "rxjs";
import {Link, NavigationInterface} from "./navigation.interface";
import {AuthService} from "../../auth/auth.service";
import {PROXY_PATH} from "../../tokens/proxy-path.token";
import {INavData} from "@coreui/angular";
import {
  INavAttributes,
  INavBadge,
  INavLabel,
  INavLinkProps,
  INavWrapper
} from "@coreui/angular/lib/sidebar/sidebar-nav/sidebar-nav";

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly proxyPath = inject(PROXY_PATH);

  private readonly links$$ = new BehaviorSubject<Link[]>([]);
  public readonly links$ = this.links$$.asObservable();

  public constructor() {
    this.loadMenu();
  }

  public navigation: INavData[] = []

  private loadMenu(): void {
    const proxyPath = this.proxyPath;
    this.authService.authenticated$.pipe(
      filter(authenticated => authenticated),
      take(1),
      switchMap(() => this.http.get<NavigationInterface>(`${proxyPath}/angular/menu.json`)),
    ).subscribe({
      next: navigation => {
        this.navigation = this.oitcToCoreUi(navigation);
      },
    });
  }

  private oitcToCoreUi(navigation: NavigationInterface): INavData[] {
    let ret: INavData[] = [];
    for (let a in navigation.menu) {
      let link: Link = navigation.menu[a] as Link;
      let inavdata: INavData = this.oitcToC2(link);
      inavdata.children = [];
      inavdata.title = true;

      ret.push(inavdata);


      for (let itemKey in link.items) {
        let myLink = link.items?.at(parseInt(itemKey)) as Link;
        ret.push(this.oitcToC2(myLink));
      }

    }

    return ret;
  }

  private oitcToC2(link: Link): INavData {
    let myMenu: INavData = {};
    myMenu.name = link.alias || link.name;
    myMenu.children = [];
    for (let itemKey in link.items) {
      let myLink = link.items?.at(parseInt(itemKey)) as Link;
      myMenu.children.push(this.oitcToC2(myLink))
    }
    return myMenu;
  }

}
