import { Routes } from '@angular/router';

export const openstreetmapModuleRoutes: Routes = [
    {
        path: 'openstreetmap_module/openstreetmap/index',
        loadComponent: () => import('./pages/openstreetmap-index/openstreetmap-index.component').then(m => m.OpenstreetmapIndexComponent)
    },
];
