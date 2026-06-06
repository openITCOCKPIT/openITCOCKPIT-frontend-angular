import { Routes } from '@angular/router';
import { KubernetesComponent } from './pages/wizards/kubernetes/kubernetes.component';

export const kubernetesModuleRoutes: Routes = [
    {
        path: 'kubernetes_module/wizards/kubernetes/:hostId/kubernetes',
        loadComponent: () => import('./pages/wizards/kubernetes/kubernetes.component').then(m => KubernetesComponent),
    },
];
