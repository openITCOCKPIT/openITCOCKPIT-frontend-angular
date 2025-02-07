import { Routes } from '@angular/router';
import {
    AutoreportSettingsIndexComponent
} from './pages/autoreport-settings/autoreport-settings-index/autoreport-settings-index.component';
import {
    AutoreportAddStepOneComponent
} from './pages/autoreports/autoreport-add-step-one/autoreport-add-step-one.component';

export const autoreportModuleRoutes: Routes = [

    {
        path: 'autoreport_module/autoreport_settings/index',
        loadComponent: () => import('./pages/autoreport-settings/autoreport-settings-index/autoreport-settings-index.component').then(m => m.AutoreportSettingsIndexComponent)
    },
    {
        path: 'autoreport_module/autoreports/index',
        loadComponent: () => import('./pages/autoreports/autoreport-index/autoreport-index.component').then(m => m.AutoreportIndexComponent)
    },
    {
        path: 'autoreport_module/autoreports/addStepOne',
        loadComponent: () => import('./pages/autoreports/autoreport-add-step-one/autoreport-add-step-one.component').then(m => m.AutoreportAddStepOneComponent)
    },
    {
        path: 'autoreport_module/autoreports/addStepTwo/:id',
        loadComponent: () => import('./pages/autoreports/autoreport-add-step-two/autoreport-add-step-two.component').then(m => m.AutoreportAddStepTwoComponent)
    },
];
