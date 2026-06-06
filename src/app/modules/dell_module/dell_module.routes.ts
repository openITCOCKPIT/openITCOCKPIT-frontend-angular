import { Routes } from '@angular/router';
import { DellIdracComponent } from './pages/wizards/dell-idrac/dell-idrac.component';

export const dellModuleRoutes: Routes = [
    {
        path: 'dell_module/wizards/dell/:hostId',
        loadComponent: () => import('./pages/wizards/dell-idrac/dell-idrac.component').then(m => DellIdracComponent)
    },
];
