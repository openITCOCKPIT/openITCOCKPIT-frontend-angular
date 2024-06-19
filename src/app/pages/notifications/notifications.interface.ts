import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { HoststatusObject } from '../hosts/hosts.interface';


export interface NotificationIndexRoot extends PaginateOrScroll {
    all_notifications: HostNotificationIndex[]
    _csrfToken: string
}

export interface HostNotificationIndex {
    NotificationHost: NotificationHostStatus
    Host: NotificationHost
    Command: NotificationCommand
    Contact: NotificationContact
}

export interface NotificationHostStatus {
    state: number
    output: string
    start_time: string
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
    'filter[NotificationHosts.state.recovery': string,
    'filter[NotificationHosts.state.down': string,
    'filter[NotificationHosts.state.unreachable': string,
    'filter[Hosts.name]': string,
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
        direction: 'asc',
        'filter[NotificationHosts.output]': '',
        'filter[NotificationHosts.state.recovery': '',
        'filter[NotificationHosts.state.down': '',
        'filter[NotificationHosts.state.unreachable': '',
        'filter[Hosts.name]': '',
        'filter[Contacts.name]': '',
        'filter[Commands.name]': '',
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 3000 * 4)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5)),
    }
}
