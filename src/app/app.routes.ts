import { Component, inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { authGuard } from "./auth/auth.guard";

// Just some quick ideas for our PoC workshop, this is no production ready code :)

@Component({
    selector: 'legacy-redirect',
    standalone: true,
    template: `If you can read this, something has to be fixed ;)`,
    imports: [RouterModule]
})
class LegacyUrlComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly document = inject(DOCUMENT);

    public constructor() {

        const {legacyUrl} = this.route.snapshot.data;

        if (legacyUrl) {

            console.log('destination', legacyUrl)
            this.document.location.href = legacyUrl;
        }
    }
}

export const routes: Routes = [{
    path: '',
    loadComponent: () => import('./pages/start-page/start-page.component').then(m => m.StartPageComponent),
    canActivate: [authGuard]
}, {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.component').then(m => m.LoginPageComponent)
}, {
    path: 'macros/index',
    loadComponent: () => import('./pages/macros/macro-index/macro-index.component').then(m => m.MacroIndexComponent)
}, {
    path: 'commands/index',
    loadComponent: () => import('./pages/commands/commands-index/commands-index.component').then(m => m.CommandsIndexComponent)
}, {
    path: 'commands/add',
    loadComponent: () => import('./pages/commands/commands-add/commands-add.component').then(m => m.CommandsAddComponent)
}, {
    path: 'commands/edit/:id',
    loadComponent: () => import('./pages/commands/commands-edit/commands-edit.component').then(m => m.CommandsEditComponent)
}, {
    path: 'commands/copy/:ids',
    loadComponent: () => import('./pages/commands/commands-copy/commands-copy.component').then(m => m.CommandsCopyComponent)
}, {
    path: 'changelogs/index',
    loadComponent: () => import('./pages/changelogs/changelogs-index/changelogs-index.component').then(m => m.ChangelogsIndexComponent)
}, {
    path: 'changelogs/entity/:type/:id',
    loadComponent: () => import('./pages/changelogs/changelogs-entity/changelogs-entity.component').then(m => m.ChangelogsEntityComponent)
}, {
    path: 'services/browser/:id',
    loadComponent: () => import('./pages/services-browser-page/services-browser-page.component').then(m => m.ServicesBrowserPageComponent)
}, {
    path: 'systemsettings/index',
    loadComponent: () => import('./pages/systemsettings/systemsettings-index/systemsettings-index.component').then(m => m.SystemsettingsIndexComponent)
}, {
    path: 'statistics/index',
    loadComponent: () => import('./pages/statistics/statistics-index/statistics-index.component').then(m => m.StatisticsIndexComponent)
}, {
    path: 'supports/issue',
    loadComponent: () => import('./pages/supports/supports-issue/supports-issue.component').then(m => m.SupportsIssueComponent)
}, {
    path: 'proxy/index',
    loadComponent: () => import('./pages/proxy/proxy-index/proxy-index.component').then(m => m.ProxyIndexComponent)
}, {
    path: 'error/404',
    loadComponent: () => import('./layouts/coreui/errors/error404/error404.component').then(m => m.Error404Component)
}, {
    path: '**',
    loadComponent: () => import('./layouts/coreui/errors/error404/error404.component').then(m => m.Error404Component)
}];
//}, {
//    path: '**', // TBD: wild card, of custom route matcher for angularjs legacy routes.
//    resolve: {
//        legacyUrl: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//            const legacyBaseUrl: string = inject(LEGACY_BASE_URL);
//            const legacyPath: string = state.url;
//            return `${legacyBaseUrl}${legacyPath}`;
//        }
//    },
//    component: LegacyUrlComponent,
//}];
