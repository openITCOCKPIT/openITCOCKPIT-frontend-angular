import { Routes } from '@angular/router';
import { SonicWallComponent } from './pages/wizards/sonic-wall/sonic-wall.component';

export const sonicWallModuleRoutes: Routes = [
    {
        path: 'sonic_wall_module/wizards/sonicWall/:hostId',
        loadComponent: () => import('./pages/wizards/sonic-wall/sonic-wall.component').then(m => SonicWallComponent)
    },
];
