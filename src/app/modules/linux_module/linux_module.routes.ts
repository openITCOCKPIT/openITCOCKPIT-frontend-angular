import { Routes } from '@angular/router';

export const linuxModuleRoutes: Routes = [
    {
        path: 'linux_module/wizards/vmwareesx/:hostId/vmware-esx',
        loadComponent: () => import('./pages/wizards/vmware-esx/vmware-esx.component').then(m => m.VmwareEsxComponent)
    },
];
