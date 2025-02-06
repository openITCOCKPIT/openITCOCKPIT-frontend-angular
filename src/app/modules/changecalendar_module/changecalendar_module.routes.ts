import { Routes } from '@angular/router';

export const changecalendarsModuleRoutes: Routes = [
    {
        path: 'changecalendar_module/changecalendars/add',
        loadComponent: () => import('./pages/changecalendars/changecalendars-add/changecalendars-add.component').then(m => m.ChangecalendarsAddComponent)
    },
    {
        path: 'changecalendar_module/changecalendars/edit/:id',
        loadComponent: () => import('./pages/changecalendars/changecalendars-edit/changecalendars-edit.component').then(m => m.ChangecalendarsEditComponent)
    },
    {
        path: 'changecalendar_module/changecalendars/index',
        loadComponent: () => import('./pages/changecalendars/changecalendars-index/changecalendars-index.component').then(m => m.ChangecalendarsIndexComponent)
    }
];
