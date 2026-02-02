import { Routes } from '@angular/router';
import { NextcloudComponent } from './pages/wizards/nextcloud/nextcloud.component';

export const nextcloudModuleRoutes: Routes = [
    {
        path: 'nextcloud_module/wizards/nextcloud/:hostId',
        loadComponent: () => import('./pages/wizards/nextcloud/nextcloud.component').then(m => NextcloudComponent),
    }
];
