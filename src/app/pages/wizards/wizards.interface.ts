import { SelectKeyValue } from '../../layouts/primeng/select.interface';

export interface WizardsIndex {
    wizards: { [key: string]: WizardElement }
    possibleWizards: any[]
    _csrfToken: string
}

export interface WizardElement {
    type_id: string
    uuid: string
    title: string
    description: string
    image: string
    directive: string
    state: string
    category: string[]
    necessity_of_assignment: boolean
    second_url: string
    selected_os: undefined | string
}

//
export interface LoadHostsByStringRoot {
    hosts: SelectKeyValue[]
    additionalInfo: any
    _csrfToken: string
}


// WIZARD POST
export interface WizardPost {
    host_id: number
    services: Service[]
}

export interface Service {
    createService: boolean
    description: string
    host_id: number
    name: string
    servicecommandargumentvalues: Servicecommandargumentvalue[]
    servicetemplate_id: number
}

export interface Servicecommandargumentvalue {
    commandargument: Commandargument
    commandargument_id: number
    created: string
    id: number
    modified: string
    servicetemplate_id: number
    value: string
}

export interface Commandargument {
    command_id: number
    created: string
    human_name: string
    id: number
    modified: string
    name: string
}

// WIZARD GET
export interface WizardGet {
    servicetemplates: Servicetemplate[]
    servicesNamesForExistCheck: { [key: string]: string }
}

export interface Servicetemplate {
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
    timeperiod_id: number
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
    freshness_threshold: any
    passive_checks_enabled: number
    event_handler_enabled: number
    active_checks_enabled: number
    retain_status_information: number
    retain_nonstatus_information: number
    notifications_enabled: number
    notes: string
    priority: number
    tags: string
    service_url: string
    sla_relevant: number
    is_volatile: number
    check_freshness: number
    created: string
    modified: string
    check_command: CheckCommand
    servicetemplatecommandargumentvalues: Servicecommandargumentvalue[]
}

export interface CheckCommand {
    id: number
    name: string
    command_line: string
    command_type: number
    human_args: any
    uuid: string
    description: string
    commandarguments: Commandargument[]
}

// WIZARD EDIT
export interface WizardGetAssignments {
    wizardAssignments: WizardAssignments
    servicetemplates: SelectKeyValue[]
    _csrfToken: string
}

// WIZARD EDIT POST
export interface WizardAssignments {
    image: string
    title: string
    category: string[]
    description: string
    directive: string
    necessity_of_assignment: boolean
    uuid: string
    id: number
    selected_os: any
    state: string
    type_id: string
    servicetemplates: {
        _ids: number[]
    }
}
