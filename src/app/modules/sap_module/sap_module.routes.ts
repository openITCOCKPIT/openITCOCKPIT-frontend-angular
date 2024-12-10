import { Routes } from '@angular/router';

export const sapModuleRoutes: Routes = [
    {
        path: 'sap_module/wizards/sap/:hostId',
        loadComponent: () => import('./pages/wizards/sap/sap.component').then(m => m.SapComponent)
    },
];
