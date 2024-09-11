import { Routes } from '@angular/router';

export const slaModuleRoutes: Routes = [
    {
        path: 'sla_module/slas/index',
        loadComponent: () => import('./pages/slas/slas-index/slas-index.component').then(m => m.SlasIndexComponent)
    },
    {
        path: 'sla_module/slas/add',
        loadComponent: () => import('./pages/slas/slas-add/slas-add.component').then(m => m.SlasAddComponent)
    },
];
