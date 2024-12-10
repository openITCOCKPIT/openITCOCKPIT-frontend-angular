import { Routes } from '@angular/router';

export const hpserverhardwareModuleRoutes: Routes = [
    {
        path: 'hpserverhardware_module/wizards/hpserverhardware/:hostId',
        loadComponent: () => import('./pages/wizards/hpserverhardware/hpserverhardware.component').then(m => m.HpserverhardwareComponent)
    }
];
