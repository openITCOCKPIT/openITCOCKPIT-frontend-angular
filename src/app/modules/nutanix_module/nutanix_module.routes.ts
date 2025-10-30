import { Routes } from '@angular/router';
import { NutanixComponent } from './pages/wizards/nutanix/nutanix.component';

export const nutanixModuleRoutes: Routes = [
    {
        path: 'nutanix_module/wizards/nutanix/:hostId',
        loadComponent: () => import('./pages/wizards/nutanix/nutanix.component').then(m => NutanixComponent)
    },
];
