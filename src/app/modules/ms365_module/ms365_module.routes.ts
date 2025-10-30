import { Routes } from '@angular/router';

export const ms365ModuleRoutes: Routes = [
    {
        path: 'ms365_module/wizards/mailbox/:hostId',
        loadComponent: () => import('./pages/wizards/mailbox/mailbox.component').then(m => m.MailboxComponent),
    },
    {
        path: 'ms365_module/wizards/onedrive/:hostId',
        loadComponent: () => import('./pages/wizards/one-drive/one-drive.component').then(m => m.OneDriveComponent),
    },
    {
        path: 'ms365_module/wizards/servicestatus/:hostId',
        loadComponent: () => import('./pages/wizards/service-status/service-status.component').then(m => m.ServiceStatusComponent),
    },
    {
        path: 'ms365_module/wizards/sharepoint/:hostId',
        loadComponent: () => import('./pages/wizards/share-point/share-point.component').then(m => m.SharePointComponent),
    },
];
