import { Routes } from '@angular/router';

export const customalertModuleRoutes: Routes = [
    {
        path: 'customalert_module/customalert_rules/index',
        loadComponent: () => import('./pages/customalert-rules/customalert-rules-index/customalert-rules-index.component').then(m => m.CustomalertRulesIndexComponent)
    }
];
