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
    {
        path: 'map_module/maps/edit/:id',
        loadComponent: () => import('./pages/maps/maps-edit/maps-edit.component').then(m => m.MapsEditComponent)
    },
    {
        path: 'map_module/maps/copy/:ids',
        loadComponent: () => import('./pages/maps/maps-copy/maps-copy.component').then(m => m.MapsCopyComponent)
    },
];
