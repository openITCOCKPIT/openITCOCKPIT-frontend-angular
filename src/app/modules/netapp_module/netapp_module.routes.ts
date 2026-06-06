import { Routes } from '@angular/router';
import { NetAppComponent } from './pages/wizards/net-app/net-app.component';

export const netAppModuleRoutes: Routes = [
    {
        path: 'net_app_module/wizards/netapp/:hostId',
        loadComponent: () => import('./pages/wizards/net-app/net-app.component').then(m => NetAppComponent)
    },
];
