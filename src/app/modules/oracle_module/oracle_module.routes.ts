import { Routes } from '@angular/router';

export const oracleModuleRoutes: Routes = [
    {
        path: 'oracle_module/wizards/oracle/:hostId',
        loadComponent: () => import('./pages/wizards/oracle/oracle.component').then(m => m.OracleComponent)
    },
];
