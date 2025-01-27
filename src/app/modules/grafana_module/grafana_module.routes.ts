import { Routes } from '@angular/router';

export const grafanaModuleRoutes: Routes = [{
    path: 'grafana_module/grafana_configuration/index',
    loadComponent: () => import('./pages/GrafanaConfiguration/grafana-configuration-index/grafana-configuration-index.component').then(m => m.GrafanaConfigurationIndexComponent)
},
];

