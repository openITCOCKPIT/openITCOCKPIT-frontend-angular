// See DowntimeHostListJson.php for source of data
export interface HostsDowntimeWidgetConfig {
    DowntimeHost: {
        comment_data: string
        was_cancelled: boolean
        was_not_cancelled: boolean
    }
    Host: {
        name: string
    }
    isRunning: boolean
    hideExpired: boolean
    sort: string
    direction: 'asc' | 'desc'
    useScroll: boolean
    scroll_interval: number
}

export interface HostDowntimeWidgetParams {
    angular: true
    scroll: boolean
    sort: string
    page: number
    direction: 'asc' | 'desc'
    'filter[DowntimeHosts.comment_data]': string
    'filter[DowntimeHosts.was_cancelled]': string | boolean
    'filter[Hosts.name]': string
    'filter[hideExpired]': 0 | 1,
    'filter[isRunning]': 0 | 1,
    limit: number
}
