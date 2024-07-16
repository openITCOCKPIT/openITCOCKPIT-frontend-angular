import { Routes } from '@angular/router';

// Just some quick ideas for our PoC workshop, this is no production ready code :)

export const distributeModuleRoutes: Routes = [
    {
        path: 'distribute_module/satellites/addSatelliteDowntime',
        loadComponent: () => import('./pages/satellites/add-satellite-downtime/add-satellite-downtime.component').then(m => m.AddSatellitedowntimeComponent)
    },
    {
        path: 'distribute_module/satellites/downtime',
        loadComponent: () => import('./pages/satellites/satellites-downtime/satellites-downtime.component').then(m => m.SatellitesDowntimeComponent)
    }
];
