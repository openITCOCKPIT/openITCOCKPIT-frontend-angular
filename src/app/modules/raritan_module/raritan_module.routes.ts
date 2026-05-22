import { Routes } from '@angular/router';
import { RaritanKvmComponent } from './pages/wizards/raritan-kvm/raritan-kvm.component';

export const raritanModuleRoutes: Routes = [
    {
        path: 'raritan_module/wizards/raritanKvm/:hostId',
        loadComponent: () => import('./pages/wizards/raritan-kvm/raritan-kvm.component').then(m => RaritanKvmComponent)
    },
];
