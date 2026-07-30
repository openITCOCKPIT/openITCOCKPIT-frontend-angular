import { Routes } from '@angular/router';
import { AristaNetworkComponent } from './pages/wizards/arista-network/arista-network.component';

export const aristaNetworksModuleRoutes: Routes = [
    {
        path: 'arista_networks_module/wizards/arista_network/:hostId',
        loadComponent: () => import('./pages/wizards/arista-network/arista-network.component').then(m => AristaNetworkComponent)
    },
];
