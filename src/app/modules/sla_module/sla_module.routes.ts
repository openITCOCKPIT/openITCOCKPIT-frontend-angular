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
    {
        path: 'sla_module/slas/edit/:id',
        loadComponent: () => import('./pages/slas/slas-edit/slas-edit.component').then(m => m.SlasEditComponent)
    },
];
