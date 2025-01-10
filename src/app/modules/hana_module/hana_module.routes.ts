import { Routes } from '@angular/router';

export const hanaModuleRoutes: Routes = [
    {
        path: 'hana_module/wizards/saphana/:hostId/sap-hana-system',
        loadComponent: () => import('./pages/wizards/sap-hana-system/sap-hana-system.component').then(m => m.SapHanaSystemComponent)
    },
    {
        path: 'hana_module/wizards/saphana/:hostId/sap-hana-tenant',
        loadComponent: () => import('./pages/wizards/sap-hana-tenant/sap-hana-tenant.component').then(m => m.SapHanaTenantComponent)
    },
];
