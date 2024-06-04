import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { GenericValidationError } from '../../generic-responses';

export interface ContactsIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc

    //   'filter[Commands.id][]': [],  Brauche ich das hier auch?

    'filter[Contacts.name]': string,
    'filter[Contacts.email]': string,
    'filter[Contacts.phone]': string,
}

export function getDefaultContactsIndexParams(): ContactsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Contacts.name',
        page: 1,
        direction: 'asc',
        'filter[Contacts.email]': "",
        'filter[Contacts.name]': "",
        'filter[Contacts.phone]': "",
    }
}

export interface ContactsIndexRoot extends PaginateOrScroll {
    all_contacts: ContactsIndex[];
    _csrfToken: string;
    isLdapAuth: boolean;
}

export interface ContactsEditRoot {
    areContainersChangeable: boolean;
    contact: ContactNest;
    _csrfToken: string;
    requiredContainers: number[];
}

export interface ContactNest {
    Contact: Contact;
}


/**********************
 *    Index action    *
 **********************/

export interface ContactsIndex {
    Contact: Contact;
    Container: Container;
}


/*******************************
 *    Definition of Contact    *
 ******************************/
export interface Contact {
    containers: ContainerIds
    customvariables: Customvariable[]
    description: string
    email: string
    host_commands: HostCommandIds
    host_notifications_enabled: number
    host_push_notifications_enabled: number
    host_timeperiod_id: number | null
    id?: number
    name: string
    notify_host_down: number
    notify_host_downtime: number
    notify_host_flapping: number
    notify_host_recovery: number
    notify_host_unreachable: number
    notify_service_critical: number
    notify_service_downtime: number
    notify_service_flapping: number
    notify_service_recovery: number
    notify_service_unknown: number
    notify_service_warning: number
    phone: string
    service_commands: ServiceCommandIds
    service_notifications_enabled: number
    service_push_notifications_enabled: number
    service_timeperiod_id: number | null
    user_id: number | null
    uuid: string
}

/*********************************
 *    Definition of Container    *
 ********************************/
// Maybe this can be done from Container Management (%hostname%/containers/index) ?
export interface Container {
    id: number
    containertype_id: number
    name: string
    parent_id: any
    lft: number
    rght: number
///    _joinData: JoinData Brauchen wir nicht wirklich im Front-End, oder?
    // Wird das Fehler werfen,wenn wir das nicht definieren, es aber übertragen wird?
}


/***************************
 *    Add / Edit action    *
 ***************************/
export interface ContactPost {
    containers: ContainerIds
    customvariables: Customvariable[]
    description: string
    email: string
    host_commands: HostCommandIds
    host_notifications_enabled: number
    host_push_notifications_enabled: number
    host_timeperiod_id: number | null
    id?: number
    name: string
    notify_host_down: number
    notify_host_downtime: number
    notify_host_flapping: number
    notify_host_recovery: number
    notify_host_unreachable: number
    notify_service_critical: number
    notify_service_downtime: number
    notify_service_flapping: number
    notify_service_recovery: number
    notify_service_unknown: number
    notify_service_warning: number
    phone: string
    service_commands: ServiceCommandIds
    service_notifications_enabled: number
    service_push_notifications_enabled: number
    service_timeperiod_id: number | null
    user_id: number | null
    uuid: string
}

export interface GenericIds {
    _ids: number[]
}

export interface ContainerIds extends GenericIds {
}

export interface HostCommandIds extends GenericIds {
}

export interface ServiceCommandIds extends GenericIds {
}


export interface Customvariable {
    id?: number
    object_id?: number
    objecttype_id: number
    name: string
    value: string
    password: number
    created?: string
    modified?: string
}

// Copy action machen wir später.
export interface ContactCopyGet {
    Contact: {
        id: number
        description: string
        email: string
        name: string
        phone: string
    }
}

export interface ContactCopyPost {

    Source: SourceContact
    Contact: ContactCopy
    Error: GenericValidationError | null
}

export interface ContactCopy {
    description: string
    email: string
    name: string
    phone: string
}

export interface SourceContact {
    id: number
    name: string
}


export interface LoadTimeperiodsRoot {
    timeperiods: Timeperiod[]
}

export interface Timeperiod {
    key: number
    value: string
}

export interface LoadTimeperiodsPost {
    container_ids: number[]
}

export interface LoadCommandsRoot {
    hostPushComamndId: number
    servicePushComamndId: number
    notificationCommands: LoadCommand[]
    _csrfToken: string
}

export interface LoadCommand {
    key: number
    value: string
}

export interface ContactUsedByContact {
    id: number
    name: string
    command_line: string
    command_type: number
    human_args: any
    uuid: string
    description: string
}

export interface ContactUsedBy {
    contact: ContactUsedByContact
    objects: ContactUsedByObjects
    total: number
    _csrfToken: string
}

export interface ContactUsedByContact {
    id: number
    uuid: string
    name: string
    description: string
    email: string
    phone: string
    user_id: any
    host_timeperiod_id: number
    service_timeperiod_id: number
    host_notifications_enabled: number
    service_notifications_enabled: number
    notify_service_recovery: number
    notify_service_warning: number
    notify_service_unknown: number
    notify_service_critical: number
    notify_service_flapping: number
    notify_service_downtime: number
    notify_host_recovery: number
    notify_host_down: number
    notify_host_unreachable: number
    notify_host_flapping: number
    notify_host_downtime: number
    host_push_notifications_enabled: number
    service_push_notifications_enabled: number
}

export interface ContactUsedByObjects {
    Contactgroups: ContactUsedByContactgroup[]
    Hosttemplates: ContactUsedByHosttemplate[]
    Servicetemplates: ContactUsedByServicetemplate[]
    Hosts: ContactUsedByHost[]
    Services: ContactUsedByService[]
    Hostescalations: ContactUsedByHostescalation[]
    Serviceescalations: ContactUsedByServiceescalation[]
}

export interface ContactUsedByContactgroup {
    id: number
    uuid: string
    container_id: number
    description: string
    container: Container
}

export interface ContactUsedByHosttemplate {
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

export interface ContactUsedByServicetemplate {
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
    service_url: string
    sla_relevant: number
    is_volatile: number
    check_freshness: number
    created: any
    modified: any
}

export interface ContactUsedByHost {
    id: number
    uuid: string
    container_id: number
    name: string
    description: any
    hosttemplate_id: number
    address: string
    command_id: any
    eventhandler_command_id: any
    timeperiod_id: any
    check_interval: any
    retry_interval: any
    max_check_attempts: any
    first_notification_delay: any
    notification_interval: any
    notify_on_down: any
    notify_on_unreachable: any
    notify_on_recovery: any
    notify_on_flapping: any
    notify_on_downtime: any
    flap_detection_enabled: any
    flap_detection_on_up: any
    flap_detection_on_down: any
    flap_detection_on_unreachable: any
    low_flap_threshold: any
    high_flap_threshold: any
    process_performance_data: any
    freshness_checks_enabled: any
    freshness_threshold: any
    passive_checks_enabled: any
    event_handler_enabled: any
    active_checks_enabled: any
    retain_status_information: any
    retain_nonstatus_information: any
    notifications_enabled: any
    notes: any
    priority: any
    check_period_id: any
    notify_period_id: any
    tags: any
    own_contacts: number
    own_contactgroups: number
    own_customvariables: number
    host_url: any
    sla_id: any
    satellite_id: number
    host_type: number
    disabled: number
    usage_flag: number
    created: string
    modified: string
    hosts_to_containers_sharing: HostsToContainersSharing[]
}

export interface HostsToContainersSharing {
    id: number
    containertype_id: number
    name: string
    parent_id: any
    lft: number
    rght: number
    _joinData: JoinData
}

export interface JoinData {
    id: number
    host_id: number
    container_id: number
}

export interface ContactUsedByService {
    id: number
    uuid: string
    name: string
    host_id: number
    servicename: string
    servicetemplate: Servicetemplate2
    _matchingData: MatchingData
}

export interface Servicetemplate2 {
    id: number
    uuid: string
    name: string
}

export interface MatchingData {
    Hosts: Hosts
}

export interface Hosts {
    name: string
    id: number
    uuid: string
    description: any
    address: string
    disabled: number
}

export interface ContactUsedByHostescalation {
    id: number
    uuid: string
    container_id: number
    timeperiod_id: number
    first_notification: number
    last_notification: number
    notification_interval: number
    escalate_on_recovery: number
    escalate_on_down: number
    escalate_on_unreachable: number
    created: string
    modified: string
    container: Container2
}

export interface Container2 {
    id: number
    containertype_id: number
    name: string
    parent_id: any
    lft: number
    rght: number
}

export interface ContactUsedByServiceescalation {
    id: number
    uuid: string
    container_id: number
    timeperiod_id: number
    first_notification: number
    last_notification: number
    notification_interval: number
    escalate_on_recovery: number
    escalate_on_warning: number
    escalate_on_unknown: number
    escalate_on_critical: number
    created: string
    modified: string
    container: Container3
}

export interface Container3 {
    id: number
    containertype_id: number
    name: string
    parent_id: any
    lft: number
    rght: number
}

export interface LoadLdapUserByStringRoot {
    ldapUsers: LdapUser[]
    _csrfToken: string
}

export interface LdapUser {
    givenname: string
    sn: string
    samaccountname: string
    email: string
    dn: string
    memberof: any[]
    display_name: string
}

export interface LdapConfigRoot {
    ldapConfig: LdapConfig
    _csrfToken: string
}

export interface LdapConfig {
    host: string
    query: string
    base_dn: string
}

/*********************************
 *    Definition of Container    *
 *********************************/
export interface LoadContainersRoot {
    containers: LoadContainersContainer[]
    _csrfToken: string
}

export interface LoadContainersContainer {
    key: number
    value: string
}

// LoadUsersByContainerId
export interface LoadUsersByContainerId {
    users: LoadUsersByContainerIdUserByContainer[]
}

export interface LoadUsersByContainerIdUserByContainer {
    key: number
    value: string
}

// LoadUsersByContainerIdRequest
export interface LoadUsersByContainerIdRequest {
    containerIds: number[]
}
