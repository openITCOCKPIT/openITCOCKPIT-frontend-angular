import { Routes } from '@angular/router';

export const mapModuleRoutes: Routes = [
    {
        path: 'map_module/maps/index',
        loadComponent: () => import('./pages/maps/maps-index/maps-index.component').then(m => m.MapsIndexComponent)
    },
    {
        path: 'map_module/maps/add',
        loadComponent: () => import('./pages/maps/maps-add/maps-add.component').then(m => m.MapsAddComponent)
    },
    /*{
        path: 'sla_module/slas/edit/:id',
        loadComponent: () => import('./pages/slas/slas-edit/slas-edit.component').then(m => m.SlasEditComponent)
    },*/
];
