import { Routes } from '@angular/router';

export const eventcorrelationModuleRoutes: Routes = [
    {
        path: 'eventcorrelation_module/eventcorrelations/view/:id',
        loadComponent: () => import('./pages/eventcorrelations/eventcorrelations-view/eventcorrelations-view.component').then(m => m.EventcorrelationsViewComponent)
    },
];
