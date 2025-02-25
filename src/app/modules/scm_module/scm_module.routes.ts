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
}
];
