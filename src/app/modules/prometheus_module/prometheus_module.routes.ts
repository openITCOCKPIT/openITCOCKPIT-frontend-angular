import { Routes } from '@angular/router';

export const prometheusModuleRoutes: Routes = [
    {
        path: 'prometheus_module/PrometheusExporters/add',
        loadComponent: () => import('./pages/PrometheusExporters/prometheus-exporters-add/prometheus-exporters-add.component').then(m => m.PrometheusExportersAddComponent)
    },
    {
        path: 'prometheus_module/PrometheusExporters/edit/:id',
        loadComponent: () => import('./pages/PrometheusExporters/prometheus-exporters-edit/prometheus-exporters-edit.component').then(m => m.PrometheusExportersEditComponent)
    },
    {
        path: 'prometheus_module/PrometheusExporters/index',
        loadComponent: () => import('./pages/PrometheusExporters/prometheus-exporters-index/prometheus-exporters-index.component').then(m => m.PrometheusExportersIndexComponent)
    },
    {
        path: 'prometheus_module/PrometheusQuery/index',
        loadComponent: () => import('./pages/PrometheusQuery/prometheus-query-index/prometheus-query-index.component').then(m => m.PrometheusQueryIndexComponent)
    },
    {
        path: 'prometheus_module/PrometheusQuery/toService/:hostId',
        loadComponent: () => import('./pages/PrometheusQuery/prometheus-query-to-service/prometheus-query-to-service.component').then(m => m.PrometheusQueryToServiceComponent)
    }
];
