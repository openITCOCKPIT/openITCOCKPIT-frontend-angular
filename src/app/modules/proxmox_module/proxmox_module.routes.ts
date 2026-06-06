import { Routes } from '@angular/router';
import { ProxmoxComponent } from './pages/wizards/proxmox/proxmox.component';
import { StorageComponent } from './pages/wizards/storage/storage.component';

export const proxmoxModuleRoutes: Routes = [
    {
        path: 'proxmox_module/wizards/proxmox/:hostId/proxmox',
        loadComponent: () => import('./pages/wizards/proxmox/proxmox.component').then(m => ProxmoxComponent),
    },
    {
        path: 'proxmox_module/wizards/proxmox/:hostId/storage',
        loadComponent: () => import('./pages/wizards/storage/storage.component').then(m => StorageComponent),
    },
];
