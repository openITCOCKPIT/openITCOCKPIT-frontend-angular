import { Routes } from '@angular/router';

export const mssqlModuleRoutes: Routes = [
    {
        path: 'mssql_module/wizards/mssql/:hostId',
        loadComponent: () => import('./pages/wizards/mssql/mssql.component').then(m => m.MssqlComponent)
    },
];
