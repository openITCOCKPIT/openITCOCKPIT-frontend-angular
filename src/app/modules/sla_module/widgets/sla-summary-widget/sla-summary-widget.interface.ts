import { TimeperiodEnity } from '../../../../pages/timeperiods/timeperiods.interface';

export interface SlaSummaryWidgetResponse {
    sla: SlaSummary
    config: SlaConfig
    ACL: {
        sla: {
            viewDetails: boolean
        }
    }
    _csrfToken: any
}

export interface SlaConfig {
    Sla: {
        id: number
    }
}

export interface SlaSummary {
    id: string|number
    name: string
    description: string
    container_id: string
    timeperiod_id: string
    start_date: any
    evaluation_interval: string
    consider_downtimes: string
    hard_state_only: string
    minimal_availability: string
    warning_threshold: string
    report_send_interval: string
    report_format: string
    report_evaluation: string
    last_send_date: string
    created: string
    modified: string
    timeperiod: TimeperiodEnity
    hostsAndServicesOverview: SlaHostsAndServicesOverview
    hostsCount: number
    servicesCount: number
}

export interface SlaHostsAndServicesOverview {
    [key: string]: SlaHostsAndServices
}

export interface SlaHostsAndServices {
    container: {
        name: string
        full_path: string
    }
    hosts: SlaHostsOverview
    services: SlaServicesOverview
}

export interface SlaHostsOverview {
    totalHosts: number
    failed: ObjectsSummary
    passed: ObjectsSummary
    not_calculated: ObjectsSummary
}

export interface SlaServicesOverview {
    totalServices: number
    failed: ObjectsSummary
    passed: ObjectsSummary
    not_calculated: ObjectsSummary
}


export interface ObjectsSummary {
    count: number
    percentage: string
    ids: number[]
}
