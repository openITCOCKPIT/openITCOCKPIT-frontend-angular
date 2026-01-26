import { Routes } from '@angular/router';
import { PaloAltoFirewallComponent } from './pages/wizards/palo-alto-firewall/palo-alto-firewall.component';

export const paloAltoModuleRoutes: Routes = [
    {
        path: 'palo_alto_module/wizards/palo_alto_firewall/:hostId',
        loadComponent: () => import('./pages/wizards/palo-alto-firewall/palo-alto-firewall.component').then(m => PaloAltoFirewallComponent)
    },
];
