import { Routes } from '@angular/router';

export const ms365ModuleRoutes: Routes = [
    {
        path: 'ms365_module/wizards/mailbox/:hostId',
        loadComponent: () => import('./pages/wizards/mailbox/mailbox.component').then(m => m.MailboxComponent),
    },
    {
        path: 'ms365_module/wizards/oneDrive/:hostId',
        loadComponent: () => import('./pages/wizards/one-drive/one-drive.component').then(m => m.OneDriveComponent),
    },
    {
        path: 'ms365_module/wizards/serviceStatus/:hostId',
        loadComponent: () => import('./pages/wizards/service-status/service-status.component').then(m => m.ServiceStatusComponent),
    },
    {
        path: 'ms365_module/wizards/sharePoint/:hostId',
        loadComponent: () => import('./pages/wizards/share-point/share-point.component').then(m => m.SharePointComponent),
    },
];
