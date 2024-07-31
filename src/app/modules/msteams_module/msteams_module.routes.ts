import { Routes } from '@angular/router';

export const msteamsModuleRoutes: Routes = [
    {
        path: 'msteams_module/msteamssettings/index',
        loadComponent: () => import('./pages/msteamssettings/msteamssettings-index/msteamssettings-index.component').then(m => m.MsteamssettingsIndexComponent)
    }
];
