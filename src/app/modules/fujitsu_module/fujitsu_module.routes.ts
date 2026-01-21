import { Routes } from '@angular/router';
import {
    FujitsuEternusTapeLibraryComponent
} from './pages/wizards/fujitsu-eternus-tape-library/fujitsu-eternus-tape-library.component';

export const fujitsuModuleRoutes: Routes = [
    {
        path: 'fujitsu_module/wizards/fujitsu_eternus_tape_library/:hostId',
        loadComponent: () => import('./pages/wizards/fujitsu-eternus-tape-library/fujitsu-eternus-tape-library.component').then(m => FujitsuEternusTapeLibraryComponent)
    },
];
