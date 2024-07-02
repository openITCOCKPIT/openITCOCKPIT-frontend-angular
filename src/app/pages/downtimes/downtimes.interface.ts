import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { HostObject } from '../hosts/hosts.interface';

export interface DowntimeObject {
    authorName: string
    commentData: string
    entryTime: string
    scheduledStartTime: string
    scheduledEndTime: string
    actualEndTime: string
    duration: number
    wasStarted: boolean
    internalDowntimeId: number
    downtimehistoryId?: number
    wasCancelled: boolean
    allowEdit: boolean
    durationHuman: string
    isCancellable: boolean
    isRunning: boolean
    isExpired: boolean
}

export interface DowntimeHostIndexRoot extends PaginateOrScroll {
    all_host_downtimes: HostDowntime[]
    _csrfToken: string
}

export interface HostDowntime {
    Host: HostObject
    DowntimeHost: DowntimeHost
}

export interface DowntimeHost {
    authorName: string
    commentData: string
    entryTime: string
    scheduledStartTime: string
    scheduledEndTime: string
    actualEndTime: string
    duration: number
    wasStarted: boolean
    internalDowntimeId: number
    downtimehistoryId: any
    wasCancelled: boolean
    allowEdit: boolean
    durationHuman: string
    isCancellable: boolean
    isRunning: boolean
    isExpired: boolean
}

export interface HostDowntimesParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[DowntimeHosts.author_name]': '',
    'filter[DowntimeHosts.comment_data]': '',
    'filter[DowntimeHosts.was_cancelled]'?: boolean | string,
    'filter[DowntimeHosts.was_not_cancelled]'?: boolean | string,
    'filter[Hosts.name]': '',
    'filter[hideExpired]': boolean,
    'filter[isRunning]': boolean,
    'filter[from]': Date | string,
    'filter[to]': Date | string,
}

export function getDefaultHostDowntimesParams(): HostDowntimesParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        sort: 'DowntimeHosts.scheduled_start_time',
        page: 1,
        direction: 'desc',
        'filter[DowntimeHosts.author_name]': '',
        'filter[DowntimeHosts.comment_data]': '',
        'filter[DowntimeHosts.was_cancelled]': '',
        'filter[DowntimeHosts.was_not_cancelled]': '',
        'filter[Hosts.name]': '',
        'filter[hideExpired]': true,
        'filter[isRunning]': false,
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 30 * 1000)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 30 * 1000 * 2))
    }
}
