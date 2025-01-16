import { Routes } from '@angular/router';

export const isarFlowModuleRoutes: Routes = [{
    path: 'isarflow_module/isarflow_settings/index',
    loadComponent: () => import('./pages/isarflow-settings/isar-flow-settings-index/isar-flow-settings-index.component').then(m => m.IsarFlowSettingsIndexComponent)
},
];

