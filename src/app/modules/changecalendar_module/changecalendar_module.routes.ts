import { Routes } from '@angular/router';

export const changecalendarsModuleRoutes: Routes = [
    {
        path: 'changecalendar_module/changecalendars/index',
        loadComponent: () => import('./pages/changecalendars/changecalendars-index/changecalendars-index.component').then(m => m.ChangecalendarsIndexComponent)
    }
];
