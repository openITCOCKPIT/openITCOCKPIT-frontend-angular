import { Routes } from '@angular/router';

export const slaModuleRoutes: Routes = [
    {
        path: 'sla_module/slas/index',
        loadComponent: () => import('./pages/slas/slas-index/slas-index.component').then(m => m.SlasIndexComponent)
    },
];
