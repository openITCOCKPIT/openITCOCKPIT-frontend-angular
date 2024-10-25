import { Routes } from '@angular/router';

export const customalertModuleRoutes: Routes = [
    {
        path: 'customalert_module/customalert_rules/add',
        loadComponent: () => import('./pages/customalert-rules/customalert-rules-add/customalert-rules-add.component').then(m => m.CustomalertRulesAddComponent)
    },
    {
        path: 'customalert_module/customalert_rules/index',
        loadComponent: () => import('./pages/customalert-rules/customalert-rules-index/customalert-rules-index.component').then(m => m.CustomalertRulesIndexComponent)
    }
];
