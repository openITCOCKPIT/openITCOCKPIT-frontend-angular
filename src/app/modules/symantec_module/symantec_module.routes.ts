import { Routes } from '@angular/router';
import { SymantecMailGatewayComponent } from './pages/wizards/symantec-mail-gateway/symantec-mail-gateway.component';

export const symantecModuleRoutes: Routes = [
    {
        path: 'symantec_module/wizards/symantec_mail_gateway/:hostId',
        loadComponent: () => import('./pages/wizards/symantec-mail-gateway/symantec-mail-gateway.component').then(m => SymantecMailGatewayComponent)
    },
];
