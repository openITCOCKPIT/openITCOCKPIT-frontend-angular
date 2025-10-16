import { Routes } from '@angular/router';
import { CiscoWlcComponent } from './pages/wizards/cisco-wlc/cisco-wlc.component';

export const ciscoWlcModuleRoutes: Routes = [
    {
        path: 'cisco_wlc_module/wizards/cisco_wlc/:hostId',
        loadComponent: () => import('./pages/wizards/cisco-wlc/cisco-wlc.component').then(m => CiscoWlcComponent)
    },
];
