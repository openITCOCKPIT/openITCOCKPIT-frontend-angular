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
    {
        path: 'vmware_module/wizards/vmware/:hostId/vmware-esx',
        loadComponent: () => import('./pages/wizards/vmware-esx/vmware-esx.component').then(m => m.VmwareEsxComponent)
    },
    {
        path: 'vmware_module/wizards/vmware/:hostId/vmware-datastores',
        loadComponent: () => import('./pages/wizards/vmware-datastores/vmware-datastores.component').then(m => m.VmwareDatastoresComponent)
    },
    {
        path: 'vmware_module/wizards/vmware/:hostId/vmware-snapshots',
        loadComponent: () => import('./pages/wizards/vmware-snapshots/vmware-snapshots.component').then(m => m.VmwareSnapshotsComponent)
    },
];
