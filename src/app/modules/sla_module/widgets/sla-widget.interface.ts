import { TimeperiodEnity } from '../../../pages/timeperiods/timeperiods.interface';
import { CalendarDateDetails } from '../../../pages/dashboards/widgets/calendar-widget/calendar-widget.interface';
import { ObjectsSummary } from '../pages/slas/slas.interface';

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

export interface SlaWidgetResponse {
    sla: SlaSimpleWidget
    config: SlaConfig
    ACL: {
        sla: {
            viewDetails: boolean
        }
    }
    _csrfToken: any
}

export interface SlaSummary {
    id: string
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

export interface SlaSimpleWidget {
    id: string
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
    hostsAndServicesOverview: SlaHostsAndServices
}


export interface SlaConfig {
    Sla: {
        id: number
    }
}

export interface SlaHostsAndServicesOverview {
    [key: string]: SlaHostsAndServicesWithContainer
}


export interface SlaHostsAndServicesWithContainer {
    container: {
        name: string
        full_path: string
    }
    hosts: SlaHostsOverview
    services: SlaServicesOverview
}

export interface SlaHostsAndServices {
    hosts: SlaHostsOverview
    services: SlaServicesOverview
}

export interface SlaHostsOverview {
    totalHosts: number
    failed: ObjectsSummary
    warning: ObjectsSummary
    passed: ObjectsSummary
    not_calculated: ObjectsSummary
}

export interface SlaServicesOverview {
    totalServices: number
    failed: ObjectsSummary
    warning: ObjectsSummary
    passed: ObjectsSummary
    not_calculated: ObjectsSummary
}


export interface SlaCalendarWidgetResponse {
    sla: SlaSimpleWidget
    dateDetails: CalendarDateDetails
    slaStatusLog: SlaCalendarStatusLog
    config: SlaConfig
    ACL: {
        sla: {
            viewDetails: boolean
        }
    }
    _csrfToken: any
}


export interface SlaCalendarStatusLog {
    [key: string]: {
        lowestValue: number
        class: string
    }
}


export interface SlasSummaryWidgetResponse {
    slas: SlaOverviewExtended[]
    config: SlaConfig
    ACL: {
        sla: {
            viewDetails: boolean
        }
    }
    _csrfToken: any
}

export interface SlaOverviewExtended {
    key: number
    value: {
        slaDetails: SlaDetails
        fulfill: boolean
        status_percent: number
        hostsAndServicesOverview: HostsAndServicesOverview

    }
}


export interface SlaDetails {
    id: number
    name: string
    description: string
    warning_threshold: number
    minimal_availability: number
    status_log: {
        [key: number]: number
    }
}


export interface SlaOverview {
    key: number
    hostsAndServicesOverview: HostsAndServicesOverview
}

export interface HostsAndServicesOverview {
    hosts: SlaObjectsSummary
    services: SlaObjectsSummary
}

export interface SlaObjectsSummary {
    total: number
    failed: SlaSummaryStatus
    warning: SlaSummaryStatus
    passed: SlaSummaryStatus
    not_calculated: SlaSummaryStatus
}

export interface SlaSummaryStatus {
    count: number
    percentage: any
    ids: number[]
}
