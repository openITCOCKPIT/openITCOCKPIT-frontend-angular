import { Routes } from '@angular/router';
import { BroadcomBESComponent } from './pages/wizards/broadcom-bes/broadcom-bes.component';

export const broadcomModuleRoutes: Routes = [
    {
        path: 'broadcom_module/wizards/broadcom_bes/:hostId',
        loadComponent: () => import('./pages/wizards/broadcom-bes/broadcom-bes.component').then(m => BroadcomBESComponent)
    },
];
