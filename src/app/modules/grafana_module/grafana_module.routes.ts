import { Routes } from '@angular/router';

export const grafanaModuleRoutes: Routes = [{
    path: 'grafana_module/grafana_configuration/index',
    loadComponent: () => import('./pages/GrafanaConfiguration/grafana-configuration-index/grafana-configuration-index.component').then(m => m.GrafanaConfigurationIndexComponent)
}, {
    path: 'grafana_module/grafana_userdashboards/index',
    loadComponent: () => import('./pages/GrafanaUserdashboards/grafana-userdashboards-index/grafana-userdashboards-index.component').then(m => m.GrafanaUserdashboardsIndexComponent)
}, {
    path: 'grafana_module/grafana_userdashboards/view/:id',
    loadComponent: () => import('./pages/GrafanaUserdashboards/grafana-userdashboards-view/grafana-userdashboards-view.component').then(m => m.GrafanaUserdashboardsViewComponent)
}, {
    path: 'grafana_module/grafana_userdashboards/editor/:id',
    loadComponent: () => import('./pages/GrafanaUserdashboards/grafana-userdashboards-editor/grafana-userdashboards-editor.component').then(m => m.GrafanaUserdashboardsEditorComponent)
}, {
    path: 'grafana_module/grafana_userdashboards/edit/:id',
    loadComponent: () => import('./pages/GrafanaUserdashboards/grafana-userdashboards-edit/grafana-userdashboards-edit.component').then(m => m.GrafanaUserdashboardsEditComponent)
}, {
    path: 'grafana_module/grafana_userdashboards/copy/:ids',
    loadComponent: () => import('./pages/GrafanaUserdashboards/grafana-userdashboards-copy/grafana-userdashboards-copy.component').then(m => m.GrafanaUserdashboardsCopyComponent)
}
];

