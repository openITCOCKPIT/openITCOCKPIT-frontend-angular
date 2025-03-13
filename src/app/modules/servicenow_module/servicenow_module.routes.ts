import { Routes } from '@angular/router';

export const servicenowModuleRoutes: Routes = [
    {
        path: 'servicenow_module/servicenow_settings/index',
        loadComponent: () => import('./pages/ServicenowSettings/servicenow-settings-index/servicenow-settings-index.component').then(m => m.ServicenowSettingsIndexComponent)
    }
];
