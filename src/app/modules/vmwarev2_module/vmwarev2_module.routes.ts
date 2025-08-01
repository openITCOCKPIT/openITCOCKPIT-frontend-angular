import { Routes } from '@angular/router';

export const vmwareV2ModuleRoutes: Routes = [
    {
        path: 'vmwarev2_module/wizards/vmware/:hostId/vmware-esx',
        loadComponent: () => import('./pages/wizards/vmware-esx/vmware-esx.component').then(m => m.VmwareEsxComponent)
    },
    {
        path: 'vmwarev2_module/wizards/vmware/:hostId/vmware-datastores',
        loadComponent: () => import('./pages/wizards/vmware-datastores/vmware-datastores.component').then(m => m.VmwareDatastoresComponent)
    },
];
