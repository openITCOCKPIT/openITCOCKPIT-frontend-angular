import { Routes } from '@angular/router';

export const distributeModuleRoutes: Routes = [
    {
        path: 'distribute_module/satellites/add',
        loadComponent: () => import('./pages/satellites/satellites-add/satellites-add.component').then(m => m.SatellitesAddComponent)
    },
    {
        path: 'distribute_module/satellites/addSatelliteDowntime',
        loadComponent: () => import('./pages/satellites/add-satellite-downtime/add-satellite-downtime.component').then(m => m.AddSatellitedowntimeComponent)
    },
    {
        path: 'distribute_module/satellites/downtime',
        loadComponent: () => import('./pages/satellites/satellites-downtime/satellites-downtime.component').then(m => m.SatellitesDowntimeComponent)
    },
    {
        path: 'distribute_module/satellites/index',
        loadComponent: () => import('./pages/satellites/satellites-index/satellites-index.component').then(m => m.SatellitesIndexComponent)
    },
    {
        path: 'distribute_module/satellites/status',
        loadComponent: () => import('./pages/satellites/satellites-status/satellites-status.component').then(m => m.SatellitesStatusComponent)
    },
    {
        path: 'distribute_module/satellites/tasks',
        loadComponent: () => import('./pages/satellites/satellites-tasks/satellites-tasks.component').then(m => m.SatellitesTasksComponent)
    }
];
