import { Routes } from '@angular/router';

export const designModuleRoutes: Routes = [
    {
        path: 'design_module/designs/edit',
        loadComponent: () => import('./pages/designs/designs-edit/designs-edit.component').then(m => m.DesignsEditComponent)
    }
];
