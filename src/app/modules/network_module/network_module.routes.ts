import { Routes } from '@angular/router';
import { NetworkinterfacesComponent } from './pages/wizards/networkinterfaces/networkinterfaces.component';

export const networkModuleRoutes: Routes = [
    {
        path: 'network_module/wizards/networkinterfaces/:hostId',
        loadComponent: () => import('./pages/wizards/networkinterfaces/networkinterfaces.component').then(m => NetworkinterfacesComponent)
    },
];
