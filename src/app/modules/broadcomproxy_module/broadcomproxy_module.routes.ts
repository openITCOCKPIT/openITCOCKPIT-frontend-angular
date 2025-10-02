import { Routes } from '@angular/router';
import { BroadcomProxyComponent } from './pages/wizards/broadcom-proxy/broadcom-proxy.component';

export const broadcomProxyModuleRoutes: Routes = [
    {
        path: 'broadcom_proxy_module/wizards/broadcom_proxy/:hostId',
        loadComponent: () => import('./pages/wizards/broadcom-proxy/broadcom-proxy.component').then(m => BroadcomProxyComponent)
    },
];
