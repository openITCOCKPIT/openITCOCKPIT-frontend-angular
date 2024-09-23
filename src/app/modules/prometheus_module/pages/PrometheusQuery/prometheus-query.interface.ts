import { ServiceEntity } from '../../../../pages/services/services.interface';

export interface PrometheusQueryApiResult {
    metricValue: {
        status: string
        data: {
            resultType: string
            result: PrometheusMetric[]

        }
    }
    alertRule: PrometheusAlertRule
    _csrfToken: any
}


export interface PrometheusMetric {
    metric: {
        // the labels of a metric such as __name__, device, instance job etc.
        [key: string]: string
    }
    // timestamp and current value
    value: [number, string]
}

export interface PrometheusAlertRule {
    id: number
    host_id: number
    service_id: number
    promql: string
    unit: string
    threshold_type: string
    warning_min: number
    warning_max: any
    critical_min: number
    critical_max: any
    warning_longer_as: string
    critical_longer_as: string
    warning_operator: string
    critical_operator: string
    created: string
    modified: string
    service: ServiceEntity
}

export interface PrometheusMetricDetails {
    __name__: string,
    label: string[],
    value: number | string,
    unit: string
}
