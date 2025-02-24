import { Routes } from '@angular/router';


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
    {
        path: 'autoreport_module/autoreports/editStepOne/:id',
        loadComponent: () => import('./pages/autoreports/autoreport-edit-step-one/autoreport-edit-step-one.component').then(m => m.AutoreportEditStepOneComponent)
    },
    {
        path: 'autoreport_module/autoreports/editStepTwo/:id',
        loadComponent: () => import('./pages/autoreports/autoreport-edit-step-two/autoreport-edit-step-two.component').then(m => m.AutoreportEditStepTwoComponent)
    },
    {
        path: 'autoreport_module/autoreports/editStepThree/:id',
        loadComponent: () => import('./pages/autoreports/autoreport-edit-step-three/autoreport-edit-step-three.component').then(m => m.AutoreportEditStepThreeComponent)
    },
    {
        path: 'autoreport_module/autoreports/generate/:id',
        loadComponent: () => import('./pages/autoreports/autoreport-generate/autoreport-generate.component').then(m => m.AutoreportGenerateComponent)
    },
    {
        path: 'autoreport_module/autoreports/serviceUsedBy/:id',
        loadComponent: () => import('./pages/autoreports/autoreport-service-used-by/autoreport-service-used-by.component').then(m => m.AutoreportServiceUsedByComponent)
    },
    {
        path: 'autoreport_module/autoreports/hostUsedBy/:id',
        loadComponent: () => import('./pages/autoreports/autoreport-host-used-by/autoreport-host-used-by.component').then(m => m.AutoreportHostUsedByComponent)
    },
]
