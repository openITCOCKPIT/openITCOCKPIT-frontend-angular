import { Routes } from '@angular/router';

export const jiraModuleRoutes: Routes = [{
    path: 'jira_module/jira_settings/index',
    loadComponent: () => import('./pages/jirasettings/jira-settings-index/jira-settings-index.component').then(m => m.JiraSettingsIndexComponent)
},
];