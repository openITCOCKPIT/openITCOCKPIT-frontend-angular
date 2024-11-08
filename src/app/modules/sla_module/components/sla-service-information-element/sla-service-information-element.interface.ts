import { Services, Sla } from '../../pages/slas/Slas.interface';

export interface SlaServiceInformationElementRoot {
    response: Response
    sla: Sla
    _csrfToken: string
}

export interface Response {
    service: Service
    evaluationDateDetails: EvaluationDateDetails
}

export interface Service {
    id: number
    host_id: number
    service_id: number
    sla_id: number
    evaluation_total_time: number
    total_time: number
    minimal_availability_percent: number
    determined_availability_percent: number
    minimal_availability_time: number
    determined_availability_time: number
    determined_outage_time: number
    determined_number_outages: number
    ok: number
    warning: number
    critical: number
    unknown: number
    evaluation_start: string
    evaluation_end: string
    created: string
    updated: string
    log: Log[]
    evaluation_total_time_human_readable: string
    determined_availability_time_human_readable: string
    determined_outage_time_human_readable: string
    determined_outage_time_percent: number
    state: string
}

export interface Log {
    id: number
    determined_availability_percent: number
    minimal_availability_percent: number
    evaluation_start: string
    sla_service_outages: any[]
    Services: Services
    state: string
    determined_number_outages: number
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



