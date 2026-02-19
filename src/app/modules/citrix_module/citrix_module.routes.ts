import { Routes } from '@angular/router';
import { CitrixNetscalerComponent } from './pages/wizards/citrix-netscaler/citrix-netscaler.component';

export const citrixModuleRoutes: Routes = [
    {
        path: 'citrix_module/wizards/citrix_netscaler/:hostId',
        loadComponent: () => import('./pages/wizards/citrix-netscaler/citrix-netscaler.component').then(m => CitrixNetscalerComponent)
    },
];
