import { Routes } from '@angular/router';

export const slaModuleRoutes: Routes = [
    {
        path: 'sla_module/slas/index',
        loadComponent: () => import('./pages/slas/slas-index/slas-index.component').then(m => m.SlasIndexComponent)
    },
    {
        path: 'sla_module/slas/add',
        loadComponent: () => import('./pages/slas/slas-add/slas-add.component').then(m => m.SlasAddComponent)
    },
    {
        path: 'sla_module/slas/edit/:id',
        loadComponent: () => import('./pages/slas/slas-edit/slas-edit.component').then(m => m.SlasEditComponent)
    },
    {
        path: 'sla_module/slas/viewDetails/:id',
        loadComponent: () => import('./pages/slas/slas-view-details/slas-view-details.component').then(m => m.SlasViewDetailsComponent)
    },
    {
        path: 'sla_module/slas/hosts/:id',
        loadComponent: () => import('./pages/slas/slas-hosts/slas-hosts.component').then(m => m.SlasHostsComponent)
    },
    {
        path: 'sla_module/slas/generate/:id',
        loadComponent: () => import('./pages/slas/slas-generate/slas-generate.component').then(m => m.SlasGenerateComponent)
    },
    {
        path: 'sla_module/host_mapping_rules/assignToHosts/:id',
        loadComponent: () => import('./pages/host-mapping-rules/host-mapping-rules-assign-to-hosts/host-mapping-rules-assign-to-hosts.component').then(m => m.HostMappingRulesAssignToHostsComponent)
    },
    {
        path: 'sla_module/sla_settings/index',
        loadComponent: () => import('./pages/sla-settings/sla-settings-index/sla-settings-index.component').then(m => m.SlaSettingsIndexComponent)
    },
    {
        path: 'sla_module/sla_availability_status_hosts_log/index/:id',
        loadComponent: () => import('./pages/sla-availability-status-hosts-log/sla-availability-status-hosts-log-index/sla-availability-status-hosts-log-index.component').then(m => m.SlaAvailabilityStatusHostsLogIndexComponent)
    },
    {
        path: 'sla_module/sla_availability_status_services_log/index/:id',
        loadComponent: () => import('./pages/sla-availability-status-services-log/sla-availability-status-services-log-index/sla-availability-status-services-log-index.component').then(m => m.SlaAvailabilityStatusServicesLogIndexComponent)
    },
];
