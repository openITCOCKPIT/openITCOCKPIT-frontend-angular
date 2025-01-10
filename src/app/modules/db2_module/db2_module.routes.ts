import { Routes } from '@angular/router';

export const db2ModuleRoutes: Routes = [
    {
        path: 'db2_module/wizards/db2/:hostId',
        loadComponent: () => import('./pages/wizards/db2/db2.component').then(m => m.Db2Component)
    },
];
