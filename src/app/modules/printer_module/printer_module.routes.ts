import { Routes } from '@angular/router';

export const printerModuleRoutes: Routes = [
    {
        path: 'printer_module/wizards/printer/:hostId',
        loadComponent: () => import('./pages/wizards/printer/printer.component').then(m => m.PrinterComponent)
    },
];
