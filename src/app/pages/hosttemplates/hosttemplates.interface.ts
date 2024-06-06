import { HosttemplateTypesEnum } from './hosttemplate-types.enum';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { IconProp, RotateProp } from '@fortawesome/fontawesome-svg-core';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { Customvariable } from '../contacts/contacts.interface';
import { GenericValidationError } from '../../generic-responses';

/**********************
 *    Index action    *
 **********************/
export interface HosttemplatesIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosttemplates.id][]': number[],
    'filter[Hosttemplates.name]': string
    'filter[Hosttemplates.hosttemplatetype_id][]': HosttemplateTypesEnum[]
}

export function getDefaultHosttemplatesIndexParams(): HosttemplatesIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hosttemplates.name',
        page: 1,
        direction: 'asc',
        'filter[Hosttemplates.id][]': [],
        'filter[Hosttemplates.name]': "",
        'filter[Hosttemplates.hosttemplatetype_id][]': [
            HosttemplateTypesEnum.GENERIC_HOSTTEMPLATE,
            //HosttemplateTypesEnum.EVK_HOSTTEMPLATE,
            //HosttemplateTypesEnum.SLA_HOSTTEMPLATE
        ]
    }
}

export interface HosttemplateIndexRoot extends PaginateOrScroll {
    all_hosttemplates: HosttemplateIndex[]
    _csrfToken: string
}

export interface HosttemplateIndex {
    Hosttemplate: {
        id: number
        uuid: string
        name: string
        description: string
        hosttemplatetype_id: number
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
        host_url: string
        sla_id?: number
        created: string
        modified: string
        allow_edit: boolean
        type: HosttemplateType
    }
}

export interface HosttemplateType {
    title: string
    color: string
    class: string
    icon: IconProp,
    rotate: RotateProp,
}

/**********************
 *    Add action    *
 **********************/

export interface HosttemplateTypeResult {
    key: number
    value: HosttemplateTypeResultDetails
}

export interface HosttemplateTypeResultDetails {
    title: string
    color: string
    class: string
    icon: IconProp,
    rotate: RotateProp,
}

export interface HosttemplateContainerResult {
    areContainersRestricted: boolean,
    containers: SelectKeyValue[]
}

export interface HosttemplatePost {
    id?: null | number
    name: string
    uuid?: string
    description: string
    command_id: number
    eventhandler_command_id: number
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
    host_url: string
    hosttemplatetype_id: number
    contacts: {
        _ids: number[]
    }
    contactgroups: {
        _ids: number[]
    }
    hostgroups: {
        _ids: number[]
    }
    customvariables: Customvariable[]
    check_command?: TemplateCheckCommand,
    hosttemplatecommandargumentvalues: HosttemplateCommandArgument[]
    prometheus_exporters: {
        _ids: number[]
    }
    sla_id: number | null
    created?: string
    modified?: string
}

export interface TemplateCheckCommand {
    id: number
    name: string
    command_line: string
    command_type: number
    human_args: any
    uuid: string
    description: string
    commandarguments: Commandargument[]
}

export interface Commandargument {
    id: number
    command_id: number
    name: string
    human_name: string
    created: string
    modified: string
}

export interface HosttemplateElements {
    timeperiods: SelectKeyValue[]
    checkperiods: SelectKeyValue[]
    contacts: SelectKeyValue[]
    contactgroups: SelectKeyValue[]
    hostgroups: SelectKeyValue[]
    exporters: SelectKeyValue[]
    slas: SelectKeyValue[]
}

export interface HosttemplateCommandArgument {
    id?: number
    commandargument_id: number
    hosttemplate_id?: number
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

export interface HosttemplateEditApiResult {
    hosttemplate: {
        Hosttemplate: HosttemplatePost,
    }
    commands: SelectKeyValue[],
    types: HosttemplateTypeResult[],
}

export interface HosttemplateCopyGet {
    hosttemplates: HosttemplateCopy[]
    commands: SelectKeyValue[]
}

export interface HosttemplateCopy {
    id?: number
    name: string
    description: string
    command_id: number
    active_checks_enabled: number,
    prometheus_exporters: PrometheusExporter[] // Not used by the server
    hosttemplatecommandargumentvalues: HosttemplateCommandArgument[]
}

export interface PrometheusExporter {
    id: number
    name: string
    container_id: number
    metric_path: string
    port: number
    scrape_interval: string
    scrape_timeout: string
    service: string
    yaml: string
    add_target_port: boolean
    _joinData: {
        id: number
        prometheus_exporter_id: number
        hosttemplate_id: number
    }
}


export interface HosttemplateCopyPost {
    Source: {
        id: number,
        name: string
    }
    Hosttemplate: HosttemplateCopy
    Error?: GenericValidationError | null
}

// 1:1 the same as the src/Model/Entity/Hosttemplate.php class
export interface HosttemplateEntity {
    id: number
    uuid: string
    name: string
    description: string
    hosttemplatetype_id: number
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
    host_url: string
    sla_id: any
    created: string
    modified: string
}
