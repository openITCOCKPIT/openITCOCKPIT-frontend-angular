import { Routes } from '@angular/router';
import { ApacheComponent } from './pages/wizards/apache/apache.component';

export const apacheModuleRoutes: Routes = [
    {
        path: 'apache_module/wizards/apache/:hostId/apache',
        loadComponent: () => import('./pages/wizards/apache/apache.component').then(m => ApacheComponent),
    },
];
