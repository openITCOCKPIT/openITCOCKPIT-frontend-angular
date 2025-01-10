import { Routes } from '@angular/router';

export const vmwaresnapshotModuleRoutes: Routes = [
    {
        path: 'vmwaresnapshot_module/wizards/vmwaresnapshot/:hostId',
        loadComponent: () => import('./pages/wizards/vmwaresnapshot/vmwaresnapshot.component').then(m => m.VmwaresnapshotComponent)
    },
];
