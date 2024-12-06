import { Routes } from '@angular/router';

export const vmwareModuleRoutes: Routes = [
    {
        path: 'vmware_module/wizards/vmware/:hostId/vmware-through-vcenter',
        loadComponent: () => import('./pages/wizards/vmware-through-vcenter/vmware-through-vcenter.component').then(m => m.VmwareThroughVcenterComponent)
    },
    {
        path: 'vmware_module/wizards/vmware/:hostId/vmware-esx-directly',
        loadComponent: () => import('./pages/wizards/vmware-esx-directly/vmware-esx-directly.component').then(m => m.VmwareEsxDirectlyComponent)
    },
];
