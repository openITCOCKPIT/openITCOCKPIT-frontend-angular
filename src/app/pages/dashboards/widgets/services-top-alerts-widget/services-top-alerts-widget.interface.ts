// See ServicesTopAlertJson.php for source of data
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { ServiceObject } from '../../../services/services.interface';

export interface ServicesTopAlertsWidgetConfig {
    state: 'ok' | 'warning' | 'critical' | 'unknown',
    not_older_than: number,
    not_older_than_unit: 'DAY' | 'HOUR' | 'MINUTE',
    scroll_interval: number,
    useScroll: boolean
}

export interface ServicesTopAlertsWidgetParams {
    angular: true
    scroll: true
    page: number
    'filter[NotificationServices.state][]': ['ok' | 'warning' | 'critical' | 'unknown']
    'filter[not_older_than]': number // in minutes
    limit: number
}


export interface ServicesTopAlertsRootResponse extends PaginateOrScroll {
    all_notifications: {
        NotificationService: {
            state: number
            output: string
            start_time: string
        },
        Host: {
            id: number
            uuid: string
            name: string
        }
        Service: ServiceObject
        count: number
    }[]
    _csrfToken: string
}
