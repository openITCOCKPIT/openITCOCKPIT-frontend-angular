import { Routes } from '@angular/router';
import { CiscoNetworkComponent } from './pages/wizards/cisco-network/cisco-network.component';

export const ciscoNetworkModuleRoutes: Routes = [
    {
        path: 'cisco_network_module/wizards/cisco_network/:hostId',
        loadComponent: () => import('./pages/wizards/cisco-network/cisco-network.component').then(m => CiscoNetworkComponent)
    },
];
