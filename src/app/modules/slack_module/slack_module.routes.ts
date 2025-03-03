import { Routes } from '@angular/router';

export const slackModuleRoutes: Routes = [{
    path: 'slack_module/slack_settings/index',
    loadComponent: () => import('./pages/slack-settings/slack-settings-index/slack-settings-index.component').then(m => m.SlackSettingsIndexComponent)
},
];
