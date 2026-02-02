import { Routes } from '@angular/router';
import { ApacheHttpComponent } from './pages/wizards/apache-http/apache-http.component';
import { ApacheTomcatComponent } from './pages/wizards/apache-tomcat/apache-tomcat.component';

export const apacheModuleRoutes: Routes = [
    {
        path: 'apache_module/wizards/apache/:hostId/apache-http',
        loadComponent: () => import('./pages/wizards/apache-http/apache-http.component').then(m => ApacheHttpComponent),
    },
    {
        path: 'apache_module/wizards/apache/:hostId/apache-tomcat',
        loadComponent: () => import('./pages/wizards/apache-tomcat/apache-tomcat.component').then(m => ApacheTomcatComponent),
    },
];
