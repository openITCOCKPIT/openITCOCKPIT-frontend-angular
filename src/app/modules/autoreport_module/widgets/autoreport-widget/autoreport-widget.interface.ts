export interface AutoreportWidgetConfigRootResponse {
    autoreport: AutoreportWidgetAutoreport,
    config: {
        Autoreport: AutoreportWidgetConfig
    }
    _csrfToken: string | null
}

export interface AutoreportWidgetConfig {
    id: number,
    in_percent: boolean,
    set_color_dynamically: boolean,
    show_update_date: boolean
    show_bar_chart?: boolean
}

export interface AutoreportWidgetAutoreport {
    id: null | number
    name?: string
    description?: string
    container_id?: number
    timeperiod_id?: number
    report_interval?: string
    report_send_interval?: string
    consider_downtimes?: boolean
    last_send_date?: string
    min_availability_percent?: boolean
    min_availability?: number
    check_hard_state?: boolean
    use_start_time?: number
    report_start_date?: any
    last_percent_value?: number
    last_absolut_value?: number
    show_time?: number
    last_number_of_outages?: number
    failure_statistic?: number
    consider_holidays?: number
    calendar_id?: number
    max_number_of_outages?: null | number
    created?: string
    modified?: string
    autoreport_availability_log?: AutoreportWidgetAutoreportAvailabilityLog[]
    last_absolut_value_human?: string
}

export interface AutoreportWidgetAutoreportAvailabilityLog {
    id: number
    autoreport_id: number
    last_update: number
    minimal_availability_percent: number
    availability_total_time: number
    determined_availability_time: number
    determined_availability_percent: number
    determined_availability_time_human: string
    last_update_human: string
}
