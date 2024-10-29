import { Routes } from '@angular/router';

export const customalertModuleRoutes: Routes = [
    {
        path: 'customalert_module/customalert_rules/add',
        loadComponent: () => import('./pages/customalert-rules/customalert-rules-add/customalert-rules-add.component').then(m => m.CustomalertRulesAddComponent)
    },
    {
        path: 'customalert_module/customalert_rules/edit/:id',
        loadComponent: () => import('./pages/customalert-rules/customalert-rules-edit/customalert-rules-edit.component').then(m => m.CustomalertRulesEditComponent)
    },
    {
        path: 'customalert_module/customalert_rules/index',
        loadComponent: () => import('./pages/customalert-rules/customalert-rules-index/customalert-rules-index.component').then(m => m.CustomalertRulesIndexComponent)
    },
    {
        path: 'customalert_module/customalert_rules/services/:id',
        loadComponent: () => import('./pages/customalert-rules/customalert-rules-services/customalert-rules-services.component').then(m => m.CustomalertRulesServicesComponent)
    },
    {
        path: 'customalert_module/customalerts/index',
        loadComponent: () => import('./pages/customalerts/customalerts-index/customalerts-index.component').then(m => m.CustomalertsIndexComponent)
    }
];
