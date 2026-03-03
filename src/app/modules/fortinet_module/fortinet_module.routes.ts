import { Routes } from '@angular/router';
import { FortigateFirewallComponent } from './pages/wizards/fortigate-firewall/fortigate-firewall.component';

export const fortinetModuleRoutes: Routes = [
    {
        path: 'fortinet_module/wizards/fortinet/:hostId/fortigate-firewall',
        loadComponent: () => import('./pages/wizards/fortigate-firewall/fortigate-firewall.component').then(m => FortigateFirewallComponent)
    },
];
