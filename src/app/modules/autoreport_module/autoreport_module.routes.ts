import { Routes } from '@angular/router';
import {
    AutoreportSettingsIndexComponent
} from './pages/autoreport-settings/autoreport-settings-index/autoreport-settings-index.component';

export const autoreportModuleRoutes: Routes = [

    {
        path: 'autoreport_module/autoreport_settings/index',
        loadComponent: () => import('./pages/autoreport-settings/autoreport-settings-index/autoreport-settings-index.component').then(m => m.AutoreportSettingsIndexComponent)
    },
];
