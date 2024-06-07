import { ServicetemplateTypesEnum } from './servicetemplate-types.enum';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { Customvariable } from '../contacts/contacts.interface';
import { GenericValidationError } from '../../generic-responses';
import { HostEntity, HostOrServiceType, HostsToContainersSharing } from '../hosts/hosts.interface';

/**********************
 *    Index action    *
 **********************/
export interface ServicetemplatesIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Servicetemplates.id][]': number[],
    'filter[Servicetemplates.name]': string
    'filter[Servicetemplates.template_name]': string
    'filter[Servicetemplates.description]': string
    'filter[Servicetemplates.servicetemplatetype_id][]': ServicetemplateTypesEnum[]
}

export function getDefaultServicetemplatesIndexParams(): ServicetemplatesIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Servicetemplates.name',
        page: 1,
        direction: 'asc',
        'filter[Servicetemplates.id][]': [],
        'filter[Servicetemplates.name]': "",
        'filter[Servicetemplates.template_name]': "",
        'filter[Servicetemplates.description]': "",
        'filter[Servicetemplates.servicetemplatetype_id][]': [
            //ServicetemplateTypesEnum.GENERIC_SERVICE,
            //ServicetemplateTypesEnum.OITC_AGENT_SERVICE,
        ]
    }
}

export interface ServicetemplateIndexRoot extends PaginateOrScroll {
    all_servicetemplates: ServicetemplateIndex[]
    _csrfToken: string
}

export interface ServicetemplateIndex {
    Servicetemplate: {
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
        timeperiod_id?: number
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
        freshness_threshold?: number
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
        allow_edit: boolean
        type: HostOrServiceType
    }
}


/**********************
 *    Add action    *
 **********************/

export interface ServicetemplateContainerResult {
    areContainersRestricted: boolean,
    containers: SelectKeyValue[]
}

export interface ServicetemplateTypeResult {
    key: number
    value: HostOrServiceType
}

export interface ServicetemplateContainerResult {
    areContainersRestricted: boolean,
    containers: SelectKeyValue[]
}

export interface ServicetemplatePost {
    id?: null | number
    name: string
    uuid?: string
    template_name: string
    description: string
    command_id: number
    eventhandler_command_id: number
    check_interval: number
    retry_interval: number
    max_check_attempts: number
    first_notification_delay: number
    notification_interval: number
    notify_on_recovery: number
    notify_on_warning: number
    notify_on_critical: number
    notify_on_unknown: number
    notify_on_flapping: number
    notify_on_downtime: number
    flap_detection_enabled: number
    flap_detection_on_ok: number
    flap_detection_on_warning: number,
    flap_detection_on_critical: number
    flap_detection_on_unknown: number
    low_flap_threshold: number
    high_flap_threshold: number
    process_performance_data: number
    freshness_threshold: number
    passive_checks_enabled: number
    event_handler_enabled: number
    active_checks_enabled: number
    retain_status_information: number
    retain_nonstatus_information: number
    notifications_enabled: number
    notes: string
    priority: number
    check_period_id: number
    notify_period_id: number
    tags: string
    container_id: number
    service_url: string
    is_volatile: number
    freshness_checks_enabled: number
    servicetemplatetype_id: ServicetemplateTypesEnum,
    contacts: {
        _ids: number[]
    },
    contactgroups: {
        _ids: number[]
    },
    servicegroups: {
        _ids: number[]
    },
    customvariables: Customvariable[]
    servicetemplatecommandargumentvalues: ServicetemplateCommandArgument[],
    servicetemplateeventcommandargumentvalues: ServicetemplateCommandArgument[],
    sla_relevant: number
    created?: string
    modified?: string
}

export interface ServicetemplateCommandArgument {
    id?: number
    commandargument_id: number
    servicetemplate_id?: number
    value: string
    created?: string
    modified?: string
    commandargument: {
        id?: number
        name: string
        human_name: string
        command_id: number
        created?: string
        modified?: string
    }
}

export interface ServicetemplateElements {
    timeperiods: SelectKeyValue[]
    checkperiods: SelectKeyValue[]
    contacts: SelectKeyValue[]
    contactgroups: SelectKeyValue[]
    servicegroups: SelectKeyValue[]
}

export interface ServicetemplateEditApiResult {
    servicetemplate: {
        Servicetemplate: ServicetemplatePost,
    }
    commands: SelectKeyValue[],
    eventhandlerCommands: SelectKeyValue[],
    types: ServicetemplateTypeResult[],
}

/**********************
 *    Copy action    *
 **********************/
export interface ServicetemplateCopyGet {
    servicetemplates: ServicetemplateCopy[]
    commands: SelectKeyValue[]
    eventhandlerCommands: SelectKeyValue[]
}


export interface ServicetemplateCopy {
    id?: number
    name: string
    template_name: string
    description: string
    command_id: number
    active_checks_enabled: number,
    servicetemplateeventcommandargumentvalues: ServicetemplateCommandArgument[]
    servicetemplatecommandargumentvalues: ServicetemplateCommandArgument[]
}

export interface ServicetemplateCopyPost {
    Source: {
        id: number,
        name: string
    }
    Servicetemplate: ServicetemplateCopy
    Error?: GenericValidationError | null
}

/**********************
 *   Used By action   *
 **********************/

export interface ServicetemplatesUsedByParams {
    angular: true,
    'filter[Services.disabled]': boolean
}

export function getDefaultServicetemplatesUsedByParams(): ServicetemplatesUsedByParams {
    return {
        angular: true,
        'filter[Services.disabled]': true
    }
}

// 1:1 the same as the src/Model/Entity/Servicetemplate.php class
export interface ServicetemplateEntity {
    id: number
    uuid: string
    name: string
    template_name: string
    description: string
    servicetemplatetype_id: number
    command_id: number
    check_command_args: string
    eventhandler_command_id: number
    timeperiod_id: number
    check_interval: number
    retry_interval: number
    max_check_attempts: number
    first_notification_delay: number
    notification_interval: number
    notify_on_down: number
    notify_on_unreachable: number
    notify_on_recovery: number
    notify_on_flapping: number
    notify_on_downtime: number
    flap_detection_enabled: number
    flap_detection_on_up: number
    flap_detection_on_down: number
    flap_detection_on_unreachable: number
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
    check_period_id: number
    notify_period_id: number
    tags: string
    container_id: number
    service_url: string
    sla_relevant: number
    is_volatile: number
    created: string
    modified: string
}

export interface HostWithServices extends HostEntity {
    hosts_to_container_sharing: HostsToContainersSharing[]
    services: ServicetemplatesUsedByService[]
}

export interface ServicetemplatesUsedByService {
    id: number
    name?: string
    disabled: number
    host_id: number
    servicetemplate: {
        id: number
        name: string
    }
    servicename: string
    hostname: string
}
