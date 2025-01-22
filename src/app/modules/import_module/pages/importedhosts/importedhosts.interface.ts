import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { Importer } from '../importers/importers.interface';
import { User } from '../../../../pages/users/users.interface';
import { HosttemplatePost } from '../../../../pages/hosttemplates/hosttemplates.interface';
import { SatelliteEntity } from '../../../distribute_module/pages/satellites/satellites.interface';
import { Host } from '@angular/core';
import { HostEntity } from '../../../../pages/hosts/hosts.interface';
import { AgentcheckPost } from '../../../../pages/agentchecks/agentchecks.interface';
import { ContainerEntity } from '../../../../pages/containers/containers.interface';
import { ServicetemplateEntity } from '../../../../pages/servicetemplates/servicetemplates.interface';

export interface ImportedhostsIndexRoot extends PaginateOrScroll {
    importedhosts: Importedhost[]
    maxUploadLimit: MaxUploadLimit
    importers: Importer[]
    _csrfToken: string
}


export interface Importedhost {
    id: number
    host_id: number
    name: string
    address: string
    identifier: string
    container_id: number
    satellite_id: number
    description: string
    flags: number
    created: string
    modified: string
    full_name: string
    imported: number
    disabled: number
    ready_for_import: number
    imported_services: ImportedService[]
    host: HostEntity
    imported_hosts_to_agentchecks: ImportedHostsToAgentcheck[]
    imported_hosts_to_servicetemplategroups: ImportedHostsToServicetemplategroup[]
    imported_hosts_to_servicetemplates: ImportedHostsToServicetemplate[]
    imported_hosts_to_containers_sharing: ImportedHostsToContainersSharing[]
    user: User
    imported_file: any
    importer: Importer
    hosttemplate: HosttemplatePost
    container: string
    readonly: boolean
    satellite?: SatelliteEntity
    allowEdit: boolean
    services_overview: any[]
    oitc_agent_services_overview: any[]
    external_services_overview: any[]
    progress: ImportedhostProgress
}

export interface ImportedService {
    id: number
    importedhost_id: number
    service_id?: number
    servicetemplate_id: number
    external_monitoring_id: number
    identifier: string
    name: string
    description?: string
    check_interval: any
    freshness_threshold?: number
    servicetype_id: number
    json_data?: string
    created: string
    modified: string
}

export interface ImportedHostsToAgentcheck {
    id: number
    importedhost_id: number
    agentcheck_id: number
    regex: string
    agentcheck: AgentcheckPost
}

export interface ImportedHostsToServicetemplategroup {
    id: number
    uuid: string
    container_id: number
    description: string
    created: string
    modified: string
    _joinData: ImportedHostsToServicetemplategroupJoinData
    servicetemplates: ServicetemplateEntity[]
    container: ContainerEntity
}

export interface ImportedHostsToServicetemplategroupJoinData {
    id: number
    importedhost_id: number
    servicetemplategroup_id: number
}

export interface ImportedHostsToServicetemplate {
    id: number
    uuid: string
    template_name: string
    name: string
    container_id: number
    servicetemplatetype_id: number
    check_period_id: number
    notify_period_id: number
    description: string
    command_id: number
    check_command_args: string
    checkcommand_info: string
    eventhandler_command_id: number
    timeperiod_id: any
    check_interval: number
    retry_interval: number
    max_check_attempts: number
    first_notification_delay: number
    notification_interval: number
    notify_on_warning: number
    notify_on_unknown: number
    notify_on_critical: number
    notify_on_recovery: number
    notify_on_flapping: number
    notify_on_downtime: number
    flap_detection_enabled: number
    flap_detection_on_ok: number
    flap_detection_on_warning: number
    flap_detection_on_unknown: number
    flap_detection_on_critical: number
    low_flap_threshold: number
    high_flap_threshold: number
    process_performance_data: number
    freshness_checks_enabled: number
    freshness_threshold: number
    passive_checks_enabled: number
    event_handler_enabled: number
    active_checks_enabled: number
    retain_status_information: number
    retain_nonstatus_information: number
    notifications_enabled: number
    notes: string
    priority: number
    tags: string
    service_url?: string
    sla_relevant: number
    is_volatile: number
    check_freshness: number
    created: string
    modified: string
    _joinData: ImportedHostsToServicetemplateJoinData
}

export interface ImportedHostsToServicetemplateJoinData {
    id: number
    importedhost_id: number
    servicetemplate_id: number
}


export interface ImportedHostsToContainersSharing {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
    _joinData: JoinData
}


export interface ImportedhostUser {
    id: number
}

export interface ImportedhostHosttemplate {
    id: number
    name: string
}

export interface ImportedhostSatellite {
    id: number
    name: string
}

export interface ImportedhostProgress {
    state: number
    comments: string[]
}

export interface MaxUploadLimit {
    value: number
    unit: string
    string: string
}
