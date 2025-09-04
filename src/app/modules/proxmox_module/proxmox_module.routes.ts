import { Routes } from '@angular/router';
import { ProxmoxComponent } from './pages/wizards/proxmox/proxmox.component';

export const proxmoxModuleRoutes: Routes = [
    {
        path: 'proxmox_module/wizards/proxmox/:hostId',
        loadComponent: () => import('./pages/wizards/proxmox/proxmox.component').then(m => ProxmoxComponent),
    },
];
