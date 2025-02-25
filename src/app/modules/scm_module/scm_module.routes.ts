import { Routes } from '@angular/router';

export const scmModuleRoutes: Routes = [{
    path: 'scm_module/resourcegroups/index',
    loadComponent: () => import('./pages/resourcegroups/resourcegroups-index/resourcegroups-index.component').then(m => m.ResourcegroupsIndexComponent)
}
];
