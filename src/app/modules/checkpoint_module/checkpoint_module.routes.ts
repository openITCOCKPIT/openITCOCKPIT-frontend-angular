import { Routes } from '@angular/router';
import { CheckpointFirewallComponent } from './pages/wizards/checkpoint-firewall/checkpoint-firewall.component';

export const checkpointModuleRoutes: Routes = [
    {
        path: 'checkpoint_module/wizards/checkpoint_firewall/:hostId',
        loadComponent: () => import('./pages/wizards/checkpoint-firewall/checkpoint-firewall.component').then(m => CheckpointFirewallComponent)
    },
];
