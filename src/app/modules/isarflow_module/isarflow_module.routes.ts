import { Routes } from '@angular/router';

export const isarFlowModuleRoutes: Routes = [{
    path: 'isarflow_module/isarflow_settings/index',
    loadComponent: () => import('./pages/isarflow-settings/isar-flow-settings-index/isar-flow-settings-index.component').then(m => m.IsarFlowSettingsIndexComponent)
}, {
    path: 'isarflow_module/isarflow_hosts/index',
    loadComponent: () => import('./pages/isarflow-hosts/isar-flow-hosts-index/isar-flow-hosts-index.component').then(m => m.IsarFlowHostsIndexComponent)
}
];

