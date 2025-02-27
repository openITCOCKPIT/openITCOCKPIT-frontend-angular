import { Routes } from '@angular/router';

export const scmModuleRoutes: Routes = [{
    path: 'scm_module/resourcegroups/index',
    loadComponent: () => import('./pages/resourcegroups/resourcegroups-index/resourcegroups-index.component').then(m => m.ResourcegroupsIndexComponent)
}, {
    path: 'scm_module/resourcegroups/add',
    loadComponent: () => import('./pages/resourcegroups/resourcegroups-add/resourcegroups-add.component').then(m => m.ResourcegroupsAddComponent)
}, {
    path: 'scm_module/resourcegroups/edit/:id',
    loadComponent: () => import('./pages/resourcegroups/resourcegroups-edit/resourcegroups-edit.component').then(m => m.ResourcegroupsEditComponent)
}, {
    path: 'scm_module/resourcegroups/usedBy/:id',
    loadComponent: () => import('./pages/resourcegroups/resourcegroups-used-by/resourcegroups-used-by.component').then(m => m.ResourcegroupsUsedByComponent)
}, {
    path: 'scm_module/resourcegroups/notifications/:id',
    loadComponent: () => import('./pages/resourcegroups/resourcegroups-notifications/resourcegroups-notifications.component').then(m => m.ResourcegroupsNotificationsComponent)
}, {
    path: 'scm_module/scm_changelogs/entity/:type/:id',
    loadComponent: () => import('./pages/scmchangelogs/scm-changelogs-entity/scm-changelogs-entity.component').then(m => m.ScmChangelogsEntityComponent)
}, {
    path: 'scm_module/scm_changelogs/index',
    loadComponent: () => import('./pages/scmchangelogs/scm-changelogs-index/scm-changelogs-index.component').then(m => m.ScmChangelogsIndexComponent)
}, {
    path: 'scm_module/resources/index',
    loadComponent: () => import('./pages/resources/resources-index/resources-index.component').then(m => m.ResourcesIndexComponent)
}, {
    path: 'scm_module/resources/add',
    loadComponent: () => import('./pages/resources/resources-add/resources-add.component').then(m => m.ResourcesAddComponent)
}, {
    path: 'scm_module/resources/edit/:id',
    loadComponent: () => import('./pages/resources/resources-edit/resources-edit.component').then(m => m.ResourcesEditComponent)
}
];
