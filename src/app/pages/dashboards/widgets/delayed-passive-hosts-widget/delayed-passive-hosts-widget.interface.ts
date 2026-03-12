import { HostStatusNames } from '../../../hosts/hosts.enum';

// See DelayedPassiveHostsJson.php for source of data
export interface DelayedPassiveHostsWidgetConfig {
    Hoststatus: {
        current_state: {
            [key in HostStatusNames]: boolean // up, down, unreachable
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
    hostpriority: string[]
    sort: string
    direction: 'asc' | 'desc'
    useScroll: boolean
    scroll_interval: number
}

export interface DelayedPassiveHostsWidgetParams {
    angular: true
    scroll: boolean
    sort: string
    page: number
    direction: 'asc' | 'desc'
    limit: number
    'filter[Hosts.name]': string
    'filter[Hosts.name_regex]': boolean
    'filter[Hosts.keywords][]': string[],
    'filter[Hosts.not_keywords][]': string[],
    'filter[Hoststatus.output]': string,
    'filter[Hoststatus.current_state][]': HostStatusNames[],
    'filter[Hoststatus.problem_has_been_acknowledged]': '' | boolean,
    'filter[Hoststatus.scheduled_downtime_depth]': '' | boolean
    'filter[Hoststatus.last_state_change][]': [
            number | null,
            'SECOND' | 'MINUTE' | 'HOUR' | 'DAY' | null
    ],
    'filter[delayed][]': [
            number | null,
            'SECOND' | 'MINUTE' | 'HOUR' | 'DAY' | null
    ],
    'filter[hostpriority][]': string[]
}
