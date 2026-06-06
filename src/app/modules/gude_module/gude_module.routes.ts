import { Routes } from '@angular/router';
import { GudeSensorsComponent } from './pages/wizards/gude-sensors/gude-sensors.component';

export const gudeModuleRoutes: Routes = [
    {
        path: 'gude_module/wizards/gude_sensors/:hostId',
        loadComponent: () => import('./pages/wizards/gude-sensors/gude-sensors.component').then(m => GudeSensorsComponent)
    },
];
