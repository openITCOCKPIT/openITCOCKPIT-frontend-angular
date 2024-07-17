import { Routes } from '@angular/router';

export const nagiosModuleRoutes: Routes = [
    {
        path: 'nagios_module/cmd/index',
        loadComponent: () => import('./pages/cmd/cmd-index/cmd-index.component').then(m => m.CmdIndexComponent)
    },
];
