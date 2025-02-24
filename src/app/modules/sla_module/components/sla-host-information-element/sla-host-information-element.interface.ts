import { Sla, SlaAvailabilityStatusService } from '../../pages/slas/slas.interface';

export interface SlaHostInformationElementRoot {
    response: Response
    sla: Sla
    _csrfToken: string
}

export interface Response {
    host: Host
    services: SlaAvailabilityStatusService[]
    evaluationDateDetails: EvaluationDateDetails
}

export interface Host {
    id: number
    host_id: number
    sla_id: number
    evaluation_total_time: number
    total_time: number
    minimal_availability_percent: number
    determined_availability_percent: number
    lowest_determined_availability_of_services_percent: number
    minimal_availability_time: number
    determined_availability_time: number
    determined_outage_time: number
    determined_number_outages: number
    up: number
    down: number
    unreachable: number
    evaluation_start: string
    evaluation_end: string
    created: string
    updated: string
    host: HostChild
    evaluation_total_time_human_readable: string
    determined_availability_time_human_readable: string
    determined_outage_time_human_readable: string
    determined_outage_time_percent: number
    state: string
}

export interface HostChild {
    id: number
    name: string
}

export interface EvaluationDateDetails {
    start: number
    end: number
    days_passed: number
    days_left: number
    total_days: number
    start_user_format: string
    end_user_format: string
}
