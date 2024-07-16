import { Routes } from '@angular/router';

export const snmpTrapModuleRoutes: Routes = [{
    path: 'snmp_trap_module/snmpttList/index',
    loadComponent: () => import('./pages/snmpttList/snmptt-list-index/snmptt-list-index.component').then(m => m.SnmpttListIndexComponent)
}];
