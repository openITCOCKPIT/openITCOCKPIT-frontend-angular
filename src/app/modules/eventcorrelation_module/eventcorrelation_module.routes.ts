import { Routes } from '@angular/router';

export const eventcorrelationModuleRoutes: Routes = [
    {
        path: 'eventcorrelation_module/eventcorrelations/index',
        loadComponent: () => import('./pages/eventcorrelations/eventcorrelations-index/eventcorrelations-index.component').then(m => m.EventcorrelationsIndexComponent)
    },
    {
        path: 'eventcorrelation_module/eventcorrelations/add',
        loadComponent: () => import('./pages/eventcorrelations/eventcorrelations-add/eventcorrelations-add.component').then(m => m.EventcorrelationsAddComponent)
    },
    {
        path: 'eventcorrelation_module/eventcorrelations/view/:id',
        loadComponent: () => import('./pages/eventcorrelations/eventcorrelations-view/eventcorrelations-view.component').then(m => m.EventcorrelationsViewComponent)
    },
    {
        path: 'eventcorrelation_module/eventcorrelations/summary_view/:id',
        loadComponent: () => import('./pages/eventcorrelations/eventcorrelations-summary-view/eventcorrelations-summary-view.component').then(m => m.EventcorrelationsSummaryViewComponent)
    },
    {
        path: 'eventcorrelation_module/eventcorrelations/usedBy/:id',
        loadComponent: () => import('./pages/eventcorrelations/eventcorrelations-used-by/eventcorrelations-used-by.component').then(m => m.EventcorrelationsUsedByComponent)
    },
    {
        path: 'eventcorrelation_module/eventcorrelations/editCorrelation/:id',
        loadComponent: () => import('./pages/eventcorrelations/eventcorrelations-edit-correlation/eventcorrelations-edit-correlation.component').then(m => m.EventcorrelationsEditCorrelationComponent)
    },
];
