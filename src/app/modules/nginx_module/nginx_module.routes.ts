import { Routes } from '@angular/router';
import { NginxComponent } from './pages/wizards/nginx/nginx.component';

export const nginxModuleRoutes: Routes = [
    {
        path: 'nginx_module/wizards/nginx/:hostId/nginx',
        loadComponent: () => import('./pages/wizards/nginx/nginx.component').then(m => NginxComponent),
    },
];
