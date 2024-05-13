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
    path: 'commands/usedBy/:id',
    loadComponent: () => import('./pages/commands/commands-used-by/commands-used-by.component').then(m => m.CommandsUsedByComponent)
}, {
    path: 'contacts/index',
    loadComponent: () => import('./pages/contacts/contacts-index/contacts-index.component').then(m => m.ContactsIndexComponent)
}, {
    path: 'contacts/add',
    loadComponent: () => import('./pages/contacts/contacts-add/contacts-add.component').then(m => m.ContactsAddComponent)
}, {
    path: 'contacts/copy/:ids',
    loadComponent: () => import('./pages/contacts/contacts-copy/contacts-copy.component').then(m => m.ContactsCopyComponent)
}, {
    path: 'contacts/edit/:id',
    loadComponent: () => import('./pages/contacts/contacts-edit/contacts-edit.component').then(m => m.ContactsEditComponent)
}, {
    path: 'contacts/ldap',
    loadComponent: () => import('./pages/contacts/contacts-ldap/contacts-ldap.component').then(m => m.ContactsLdapComponent)
}, {
    path: 'contacts/usedBy/:id',
    loadComponent: () => import('./pages/contacts/contacts-used-by/contacts-used-by.component').then(m => m.ContactsUsedByComponent)
}, {
    path: 'changelogs/index',
    loadComponent: () => import('./pages/changelogs/changelogs-index/changelogs-index.component').then(m => m.ChangelogsIndexComponent)
}, {
    path: 'changelogs/entity/:type/:id',
    loadComponent: () => import('./pages/changelogs/changelogs-entity/changelogs-entity.component').then(m => m.ChangelogsEntityComponent)
}, {
    path: 'services/index',
    loadComponent: () => import('./pages/services/services-index/services-index.component').then(m => m.ServicesIndexComponent)
}, {
    path: 'services/browser/:id',
    loadComponent: () => import('./pages/services/services-browser-page/services-browser-page.component').then(m => m.ServicesBrowserPageComponent)
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
    path: 'registers/index',
    loadComponent: () => import('./pages/registers/registers-index/registers-index.component').then(m => m.RegistersIndexComponent)
}, {
    path: 'profile/edit',
    loadComponent: () => import('./pages/profile/profile-edit/profile-edit.component').then(m => m.ProfileEditComponent)
}, {
    path: 'calendars/index',
    loadComponent: () => import('./pages/calendars/calendars-index/calendars-index.component').then(m => m.CalendarsIndexComponent)
}, {
    path: 'calendars/add',
    loadComponent: () => import('./pages/calendars/calendars-add/calendars-add.component').then(m => m.CalendarsAddComponent)
}, {
    path: 'documentations/view/:uuid/:type',
    loadComponent: () => import('./pages/documentations/documentations-view/documentations-view.component').then(m => m.DocumentationsViewComponent)
}, {
    path: 'documentations/edit/:uuid/:type',
    loadComponent: () => import('./pages/documentations/documentations-edit/documentations-edit.component').then(m => m.DocumentationsEditComponent)
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
