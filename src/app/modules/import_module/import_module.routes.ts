import { Routes } from '@angular/router';

export const importModuleRoutes: Routes = [{
    path: 'import_module/ImportedHostgroups/dependencyTree/:id',
    loadComponent: () => import('./pages/importedhostgroups/imported-hostgroups-dependency-tree/imported-hostgroups-dependency-tree.component').then(m => m.ImportedHostgroupsDependencyTreeComponent)
}, {
    path: 'import_module/ImportedHostgroups/index',
    loadComponent: () => import('./pages/importedhostgroups/imported-hostgroups-index/imported-hostgroups-index.component').then(m => m.ImportedHostgroupsIndexComponent)
}, {
    path: 'import_module/ImportedHostgroups/view/:id',
    loadComponent: () => import('./pages/importedhostgroups/imported-hostgroups-view/imported-hostgroups-view.component').then(m => m.ImportedHostgroupsViewComponent)
}, {
    path: 'import_module/import_changelogs/entity/:type/:id',
    loadComponent: () => import('./pages/importchangelogs/import-changelogs-entity/import-changelogs-entity.component').then(m => m.ImportChangelogsEntityComponent)
}, {
    path: 'import_module/import_changelogs/index',
    loadComponent: () => import('./pages/importchangelogs/import-changelogs-index/import-changelogs-index.component').then(m => m.ImportChangelogsIndexComponent)
}, {
    path: 'import_module/ExternalSystems/index',
    loadComponent: () => import('./pages/externalsystems/external-systems-index/external-systems-index.component').then(m => m.ExternalSystemsIndexComponent)
}, {
    path: 'import_module/ExternalSystems/add',
    loadComponent: () => import('./pages/externalsystems/external-systems-add/external-systems-add.component').then(m => m.ExternalSystemsAddComponent)
}, {
    path: 'import_module/ExternalSystems/edit/:id',
    loadComponent: () => import('./pages/externalsystems/external-systems-edit/external-systems-edit.component').then(m => m.ExternalSystemsEditComponent)
}, {
    path: 'import_module/ExternalMonitorings/index',
    loadComponent: () => import('./pages/externalmonitorings/external-monitorings-index/external-monitorings-index.component').then(m => m.ExternalMonitoringsIndexComponent)
}, {
    path: 'import_module/ExternalMonitorings/add',
    loadComponent: () => import('./pages/externalmonitorings/external-monitorings-add/external-monitorings-add.component').then(m => m.ExternalMonitoringsAddComponent)
}
];
