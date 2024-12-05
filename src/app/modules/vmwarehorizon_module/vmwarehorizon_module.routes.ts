import { Routes } from '@angular/router';

export const vmwarehorizonModuleRoutes: Routes = [
    {
        path: 'vmwarehorizon_module/wizards/vmwarehorizon/:hostId',
        loadComponent: () => import('./pages/wizards/vmwarehorizon/vmwarehorizon.component').then(m => m.VmwarehorizonComponent)
    },
];
