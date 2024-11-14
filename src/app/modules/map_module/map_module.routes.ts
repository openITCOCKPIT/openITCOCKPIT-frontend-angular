import { Routes } from '@angular/router';

export const mapModuleRoutes: Routes = [
    {
        path: 'map_module/maps/index',
        loadComponent: () => import('./pages/maps/maps-index/maps-index.component').then(m => m.MapsIndexComponent)
    },
    /*{
        path: 'sla_module/slas/add',
        loadComponent: () => import('./pages/slas/slas-add/slas-add.component').then(m => m.SlasAddComponent)
    },
    {
        path: 'sla_module/slas/edit/:id',
        loadComponent: () => import('./pages/slas/slas-edit/slas-edit.component').then(m => m.SlasEditComponent)
    },*/
];
