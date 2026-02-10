import { Routes } from '@angular/router';

export const msWindowsAgentlessModuleRoutes: Routes = [
    {
        path: 'ms_windows_agentless_module/wizards/agentless_windows/:hostId',
        loadComponent: () => import('./pages/wizards/agentless-windows/agentless-windows.component').then(m => m.AgentlessWindowsComponent)
    }
];
