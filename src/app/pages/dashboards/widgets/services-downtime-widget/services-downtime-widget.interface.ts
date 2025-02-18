// See DowntimeServiceListJson.php for source of data
export interface ServicesDowntimeWidgetConfig {
    DowntimeService: {
        comment_data: string
        was_cancelled: boolean
        was_not_cancelled: boolean
    }
    Host: {
        name: string
    }
    Service: {
        name: string
    }
    isRunning: boolean
    hideExpired: boolean
    sort: string
    direction: 'asc' | 'desc'
    useScroll: boolean
    scroll_interval: number
}

export interface ServiceDowntimeWidgetParams {
    angular: true
    scroll: boolean
    sort: string
    page: number
    direction: 'asc' | 'desc'
    'filter[DowntimeServices.comment_data]': string
    'filter[DowntimeServices.was_cancelled]': string | boolean
    'filter[Hosts.name]': string
    'filter[servicename]': string
    'filter[hideExpired]': 0 | 1
    'filter[isRunning]': 0 | 1
    limit: number
}
