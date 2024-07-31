import { Routes } from '@angular/router';

export const pagerdutyModuleRoutes: Routes = [
    {
        path: 'pagerduty_module/settings/edit',
        loadComponent: () => import('./pages/settings/settings-edit/settings-edit.component').then(m => m.SettingsEditComponent)
    },
];
