import { ServiceStatusNames } from '../../../services/services.enum';

// See DelayedPassiveServicesJson.php for source of data
export interface DelayedPassiveServicesWidgetConfig {
    Servicestatus: {
        current_state: {
            [key in ServiceStatusNames]: boolean // up, down, unreachable
        }
        acknowledged: boolean
        not_acknowledged: boolean
        in_downtime: boolean
        not_in_downtime: boolean
        output: string
        state_older_than: null | number
        state_older_than_unit: 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY'
        delayed_greater_than: null | number
        delayed_greater_than_unit: 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY'
    }
    Host: {
        name: string
        name_regex: boolean
        keywords: string
        not_keywords: string
    }
    Service: {
        name: string
        name_regex: boolean
        keywords: string
        not_keywords: string
    },
    servicepriority: number[]
    sort: string
    direction: 'asc' | 'desc'
    useScroll: boolean
    scroll_interval: number
}

export interface DelayedPassiveServicesWidgetParams {
    angular: true
    scroll: boolean
    sort: string
    page: number
    direction: 'asc' | 'desc'
    limit: number
    'filter[Hosts.name]': string
    'filter[Hosts.name_regex]': boolean
    'filter[Hosts.keywords][]': string[]
    'filter[Hosts.not_keywords][]': string[]
    'filter[servicename]': string
    'filter[servicename_regex]': boolean
    'filter[keywords][]': string[]
    'filter[not_keywords][]': string[]
    'filter[Servicestatus.output]': string,
    'filter[Servicestatus.current_state][]': ServiceStatusNames[],
    'filter[Servicestatus.problem_has_been_acknowledged]': '' | boolean,
    'filter[Servicestatus.scheduled_downtime_depth]': '' | boolean
    'filter[Servicestatus.last_state_change][]': [
            number | null,
            'SECOND' | 'MINUTE' | 'HOUR' | 'DAY' | null
    ],
    'filter[delayed][]': [
            number | null,
            'SECOND' | 'MINUTE' | 'HOUR' | 'DAY' | null
    ],
    'filter[servicepriority][]': number[]
}
