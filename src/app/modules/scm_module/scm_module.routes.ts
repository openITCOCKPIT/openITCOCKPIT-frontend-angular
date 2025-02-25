import { Routes } from '@angular/router';

export const scmModuleRoutes: Routes = [{
    path: 'scm_module/resourcegroups/index',
    loadComponent: () => import('./pages/resourcegroups/resourcegroups-index/resourcegroups-index.component').then(m => m.ResourcegroupsIndexComponent)
}, {
    path: 'scm_module/resourcegroups/add',
    loadComponent: () => import('./pages/resourcegroups/resourcegroups-add/resourcegroups-add.component').then(m => m.ResourcegroupsAddComponent)
}
];
