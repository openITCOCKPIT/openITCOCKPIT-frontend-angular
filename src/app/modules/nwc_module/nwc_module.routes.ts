import { Routes } from '@angular/router';
import { NetworkbasicComponent } from './pages/wizards/networkbasic/networkbasic.component';

export const nwcModuleRoutes: Routes = [
    {
        path: 'nwc_module/wizards/networkbasic/:hostId',
        loadComponent: () => import('./pages/wizards/networkbasic/networkbasic.component').then(m => NetworkbasicComponent)
    },
];
