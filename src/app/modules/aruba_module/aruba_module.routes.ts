import { Routes } from '@angular/router';
import { ArubaNetworkComponent } from './pages/wizards/aruba-network/aruba-network.component';

export const arubaModuleRoutes: Routes = [
    {
        path: 'aruba_module/wizards/aruba_network/:hostId',
        loadComponent: () => import('./pages/wizards/aruba-network/aruba-network.component').then(m => ArubaNetworkComponent)
    },
];
