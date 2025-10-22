import { Routes } from '@angular/router';
import { CiscoNetworkComponent } from './pages/wizards/cisco-network/cisco-network.component';
import { CiscoWlcComponent } from './pages/wizards/cisco-wlc/cisco-wlc.component';

export const ciscoModuleRoutes: Routes = [
    {
        path: 'cisco_module/wizards/:hostId/cisco_network',
        loadComponent: () => import('./pages/wizards/cisco-network/cisco-network.component').then(m => CiscoNetworkComponent)
    },
    {
        path: 'cisco_module/wizards/:hostId/cisco_wlc',
        loadComponent: () => import('./pages/wizards/cisco-wlc/cisco-wlc.component').then(m => CiscoWlcComponent)
    },
];
