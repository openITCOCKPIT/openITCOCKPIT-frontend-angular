import { Routes } from '@angular/router';
import { HyperVComponent } from './pages/wizards/hyper-v/hyper-v.component';

export const mshypervModuleRoutes: Routes = [
    {
        path: 'mshyperv_module/wizards/hyperv/:hostId',
        loadComponent: () => import('./pages/wizards/hyper-v/hyper-v.component').then(m => HyperVComponent),
    },
];
