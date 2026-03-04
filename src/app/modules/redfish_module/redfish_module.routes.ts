import { Routes } from '@angular/router';
import { RedfishComponent } from './pages/wizards/redfish/redfish.component';

export const redfishModuleRoutes: Routes = [
    {
        path: 'redfish_module/wizards/redfish/:hostId',
        loadComponent: () => import('./pages/wizards/redfish/redfish.component').then(m => RedfishComponent),
    }
];
