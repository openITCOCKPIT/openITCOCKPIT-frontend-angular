import { Routes } from '@angular/router';

export const mattermostModuleRoutes: Routes = [{
    path: 'mattermost_module/MattermostSettings/index',
    loadComponent: () => import('./pages/MattermostSettings/mattermost-settings-index/mattermost-settings-index.component').then(m => m.MattermostSettingsIndexComponent)
},
];
