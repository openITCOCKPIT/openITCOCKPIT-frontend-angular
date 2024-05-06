import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

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
}

export interface ContactsEditRoot {
    contact: ContactNest;
    _csrfToken: string;
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
    name: string
    objecttype_id: number
    password: number
    value: string
}

// Copy action machen wir später.
export interface ContactCopyGet {
}

export interface ContactCopyPost {
}

export interface SourceContact {
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
