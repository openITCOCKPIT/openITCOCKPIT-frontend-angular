import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { NotificationReasonTypesEnum } from './notification-reason-types.enum';

export interface NotificationIndexRoot extends PaginateOrScroll {
    all_notifications: NotificationIndex[]
    _csrfToken: string
}

export interface NotificationServicesRoot extends PaginateOrScroll {
    all_notifications: NotificationServices[]
    _csrfToken: string
}

export interface NotificationIndex {
    NotificationHost: Notification
    Host: NotificationHost
    Command: NotificationCommand
    Contact: NotificationContact
}

export interface NotificationServices {
    NotificationService: Notification
    Host: NotificationHost
    Service: NotificationService
    Command: NotificationCommand
    Contact: NotificationContact
}

export interface NotificationService {
    id: string
    uuid: string
    servicename: string
    hostname: any
    description: any
    active_checks_enabled: any
    tags: any
    host_id: any
    allow_edit: boolean
    disabled: boolean
    serviceType: number
    priority: any
}


export interface Notification {
    state: number
    output: string
    start_time: string
    reason_type: NotificationReasonTypesEnum
}

export interface NotificationHost {
    id: string
    uuid: string
    hostname: string
    address: any
    description: any
    hosttemplate_id: any
    active_checks_enabled: any
    satelliteId: any
    containerId: any
    containerIds: any
    tags: any
    usageFlag: any
    allow_edit: boolean
    disabled: boolean
    priority: any
    notes: any
    is_satellite_host: boolean
    name: string
}

export interface NotificationCommand {
    id: number
    name: string
    command_line: any
    command_type: any
    description: any
}

export interface NotificationContact {
    id: number
    name: string
}

export interface NotificationIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[NotificationHosts.output]': '',
    'filter[NotificationHosts.state][]': string [],
    'filter[Hosts.name]': string,
    'filter[Contacts.name]': string,
    'filter[Commands.name]': string,
    'filter[from]': Date | string,
    'filter[to]': Date | string,
}

export interface NotificationServicesParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[NotificationServices.output]': '',
    'filter[NotificationServices.state][]': string [],
    'filter[Hosts.name]': string,
    'filter[servicename]': string,
    'filter[Contacts.name]': string,
    'filter[Commands.name]': string,
    'filter[from]': Date | string,
    'filter[to]': Date | string,
}

export function getDefaultNotificationsIndexParams(): NotificationIndexParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        sort: 'NotificationHosts.start_time',
        page: 1,
        direction: 'desc',
        'filter[NotificationHosts.output]': '',
        'filter[NotificationHosts.state][]': [],
        'filter[Hosts.name]': '',
        'filter[Contacts.name]': '',
        'filter[Commands.name]': '',
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 1000 * 30)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5)),
    }
}

export function getDefaultNotificationsServicesParams(): NotificationServicesParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        sort: 'NotificationServices.start_time',
        page: 1,
        direction: 'desc',
        'filter[NotificationServices.output]': '',
        'filter[NotificationServices.state][]': [],
        'filter[Hosts.name]': '',
        'filter[servicename]': '',
        'filter[Contacts.name]': '',
        'filter[Commands.name]': '',
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 1000 * 30)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5)),
    }
}

export interface HostNotificationsStateFilter {
    recovery: boolean
    down: boolean
    unreachable: boolean
}

/**
 * Generic function that can be used by more actionms than notifications
 * @param state
 */
export function getHostNotificationStateForApi(state: HostNotificationsStateFilter): string[] {
    let result = [];
    if (state.recovery) {
        result.push('recovery');
    }
    if (state.down) {
        result.push('down');
    }
    if (state.unreachable) {
        result.push('unreachable');
    }

    return result;
}

/**
 * Wrapper with a more generic name
 * @param state
 */
export function getHostStateForApi(state: HostNotificationsStateFilter): string[] {
    return getHostNotificationStateForApi(state);
}

export interface ServiceNotificationsStateFilter {
    ok: boolean
    warning: boolean
    critical: boolean
    unknown: boolean
}

/**
 * Generic function that can be used by more actionms than notifications
 * @param state
 */
export function getServiceNotificationStateForApi(state: ServiceNotificationsStateFilter): string[] {
    let result = [];
    if (state.ok) {
        result.push('ok');
    }
    if (state.warning) {
        result.push('warning');
    }
    if (state.critical) {
        result.push('critical');
    }
    if (state.unknown) {
        result.push('unknown');
    }
    return result;
}

/**
 * Wrapper with a more generic name
 * @param state
 */
export function getServiceStateForApi(state: ServiceNotificationsStateFilter): string[] {
    return getServiceNotificationStateForApi(state);
}
