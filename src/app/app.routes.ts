import {Component, inject} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {ActivatedRoute, ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes} from '@angular/router';
import {LEGACY_BASE_URL} from "./tokens/legacy-base-url.token";

// Just some quick ideas for our PoC workshop, this is no production ready code :)

@Component({standalone: true, template: `If you can read this, something has to be fixed ;)`, imports: [RouterModule]})
class LegacyUrlComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  public constructor() {

    const { legacyUrl } = this.route.snapshot.data;

    if (legacyUrl) {
      this.document.location = legacyUrl;
    }
  }
}

export const routes: Routes = [{
  path: '',
  loadComponent: () => import('./pages/start-page/start-page.component').then(m => m.StartPageComponent)
}, {
  path: '**', // TBD: wild card, of custom route matcher for angularjs legacy routes.
  resolve: {
    legacyUrl: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      const legacyBaseUrl: string = inject(LEGACY_BASE_URL);
      const legacyPath: string = state.url;
      return `${legacyBaseUrl}${legacyPath}`;
    }
  },
  component: LegacyUrlComponent,
}];
