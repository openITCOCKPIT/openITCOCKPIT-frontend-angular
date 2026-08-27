import { ScaleTypes } from '../../../components/popover-graph/scale-types';

export interface WelcomeWidgetResponse {
    isCommunityEdition: boolean
    hasSubscription: boolean
    server_timezone: string
    user_timezone: string
    userImage: string
    user_fullname: string
    user_fullname_avatar: string
    OPENITCOCKPIT_VERSION: string
    _csrfToken: string
}

export interface TodayWidgetResponse {
    dateDetails: {
        dayNumber: number
        weekday: string
        monthName: string
        start: string
        end: string
        today_timestamp: number
        yesterday_timestamp: number
        start_timestamp: number
        end_timestamp: number
    }
    _csrfToken: string
}



export interface PerformanceWidgetDatasources {
    [key: string]: PerformanceWidgetPerfdata
}

export interface PerformanceWidgetPerfdata {
    current: string
    unit: null | string
    warning: string | null
    critical: string | null
    min: number | null,
    max: number | null,
    metric: string
    datasource: {
        setup: {
            metric: {
                value: number,
                unit: string,
                name: ScaleTypes
            },
            scale: {
                min: number | null,
                max: number | null,
                type: string,
            }
            warn: {
                low: null | number,
                high: null | number,
            }
            crit: {
                low: null | number,
                high: null | number,
            }
        }
    }
}
