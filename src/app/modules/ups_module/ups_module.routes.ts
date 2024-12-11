import { Routes } from '@angular/router';

export const upsModuleRoutes: Routes = [
    {
        path: 'ups_module/wizards/ups/:hostId',
        loadComponent: () => import('./pages/wizards/ups/ups.component').then(m => m.UpsComponent)
    },
];
