// See HostsTopAlertJson.php for source of data
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { HostObject } from '../../../hosts/hosts.interface';

export interface HostsTopAlertsWidgetConfig {
    state: 'up' | 'down' | 'unreachable',
    not_older_than: number,
    not_older_than_unit: 'DAY' | 'HOUR' | 'MINUTE',
    scroll_interval: number,
    useScroll: boolean
}

export interface HostsTopAlertsWidgetParams {
    angular: true
    scroll: true
    page: number
    'filter[NotificationHosts.state][]': ['up' | 'down' | 'unreachable']
    'filter[not_older_than]': number // in minutes
    limit: number
}


export interface HostTopAlertsRootResponse extends PaginateOrScroll {
    all_notifications: {
        NotificationHost: {
            state: number
            output: string
            start_time: string
        },
        Host: HostObject
        count: number
    }[]
    _csrfToken: string
}
