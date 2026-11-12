import { Routes } from '@angular/router';

export const cveModuleRoutes: Routes = [{
    path: 'cve_module/cves/index',
    loadComponent: () => import('./pages/cves/cves-index/cves-index.component').then(m => m.CvesIndexComponent)
}, {
    path: 'cve_module/cves/host/:id',
    loadComponent: () => import('./pages/cves/cves-host/cves-host.component').then(m => m.CvesHostComponent)
}, {
    path: 'cve_module/cves/finding/:id',
    loadComponent: () => import('./pages/cves/cves-finding/cves-finding.component').then(m => m.CvesFindingComponent)
}, {
    path: 'cve_module/cves/decisions',
    loadComponent: () => import('./pages/cves/cves-decisions/cves-decisions.component').then(m => m.CvesDecisionsComponent)
}, {
    path: 'cve_module/cves/cves',
    loadComponent: () => import('./pages/cves/cves-cves/cves-cves.component').then(m => m.CvesCvesComponent)
}, {
    path: 'cve_module/cves/view/:cveId',
    loadComponent: () => import('./pages/cves/cves-view/cves-view.component').then(m => m.CvesViewComponent)
}, {
    path: 'cve_module/cves/recommendations',
    loadComponent: () => import('./pages/cves/cves-recommendations/cves-recommendations.component').then(m => m.CvesRecommendationsComponent)
}, {
    path: 'cve_module/cves/software',
    loadComponent: () => import('./pages/cves/cves-software/cves-software.component').then(m => m.CvesSoftwareComponent)
}];
