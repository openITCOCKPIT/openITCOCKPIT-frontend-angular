import { Routes } from '@angular/router';

export const importModuleRoutes: Routes = [{
    path: 'import_module/ImportedHostgroups/dependencyTree/:id',
    loadComponent: () => import('./pages/importedhostgroups/imported-hostgroups-dependency-tree/imported-hostgroups-dependency-tree.component').then(m => m.ImportedHostgroupsDependencyTreeComponent)
}];
