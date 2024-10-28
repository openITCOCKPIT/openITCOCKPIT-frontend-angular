import { Routes } from '@angular/router';

export const checkmkModuleRoutes: Routes = [
    {
        path: 'checkmk_module/mkagents/index',
        loadComponent: () => import('./pages/mkagents/mkagents-index/mkagents-index.component').then(m => m.MkagentsIndexComponent)
    }, {
        path: 'checkmk_module/mkagents/add',
        loadComponent: () => import('./pages/mkagents/mkagents-add/mkagents-add.component').then(m => m.MkagentsAddComponent)
    }, {
        path: 'checkmk_module/mkagents/edit/:id',
        loadComponent: () => import('./pages/mkagents/mkagents-edit/mkagents-edit.component').then(m => m.MkagentsEditComponent)
    }, {
        path: 'checkmk_module/mkagents/download',
        loadComponent: () => import('./pages/mkagents/mkagents-download/mkagents-download.component').then(m => m.MkagentsDownloadComponent)
    }, {
        path: 'checkmk_module/scans/index/:id',
        loadComponent: () => import('./pages/scans/scans-index/scans-index.component').then(m => m.ScansIndexComponent)
    }, {
        path: 'checkmk_module/mkchecks/index',
        loadComponent: () => import('./pages/mkchecks/mkchecks-index/mkchecks-index.component').then(m => m.MkchecksIndexComponent)
    }, {
        path: 'checkmk_module/mkchecks/add',
        loadComponent: () => import('./pages/mkchecks/mkchecks-add/mkchecks-add.component').then(m => m.MkchecksAddComponent)
    }, {
        path: 'checkmk_module/mkchecks/edit/:id',
        loadComponent: () => import('./pages/mkchecks/mkchecks-edit/mkchecks-edit.component').then(m => m.MkchecksEditComponent)
    },
];
