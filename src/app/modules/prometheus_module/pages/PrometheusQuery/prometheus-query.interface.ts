import { ServiceEntity } from '../../../../pages/services/services.interface';
import { Datasource } from '../../../../components/popover-graph/popover-graph.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

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

// https://master/prometheus_module/PrometheusQuery/getPerfdataByUuid.json?
export interface PrometheusPerformanceDataParams {
    angular: boolean,
    end: number,
    host_uuid: string,
    jsTimestamp: number,
    metric: string,
    start: number
}

export interface PrometheusPerformanceDataRoot {
    performance_data: {
        datasource: Datasource
        data: {
            [key: string]: number
        }
    }[]
    _csrfToken: any
}


// LOAD SERVICETEMPLATES RESPONSE
export interface LoadServicetemplates {
    servicetemplates: SelectKeyValue[]
    _csrfToken: string
}

// LOAD VALUE BY METRIC
export interface LoadValueByMetricRoot {
    metricDetails: {
        status: string
        data: {
            resultType: string
            result: {
                metric: {
                    __name__: string
                    device: string
                    fstype: string
                    instance: string
                    job: string
                    mountpoint: string
                    service: string
                    uuid: string
                }
                value: [number, string]
            }[]
        }
    }
    _csrfToken: any
}


// prometheus_module/PrometheusQuery/index

export interface PrometheusQueryIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,

    hostId: number,
    'filter[PrometheusQuery.name]': string,
}

export function getDefaultPrometheusQueryIndexParams(): PrometheusQueryIndexParams {
    return {
        angular: true,
        hostId: 0,
        'filter[PrometheusQuery.name]': '',
    }
}

export interface PrometheusQueryIndexRoot {
    targets: PrometheusQueryIndexTarget
    host: Host
    _csrfToken: any
}

export interface PrometheusQueryIndexTarget {
    status: string
    data: PrometheusQueryIndexTargetDatum[]
}

export interface PrometheusQueryIndexTargetDatum {
    target: Target
    metric: string
    type: string
    help: string
    unit: string
}

export interface Target {
    instance: string
    job: string
    service: string
    uuid: string
}

export interface Host {
    id: number
    uuid: string
    name: string
    address: string
    container_id: number
    satellite_id: number
    hosts_to_containers_sharing: {
        id: number
        containertype_id: number
        name: string
        parent_id: number
        lft: number
        rght: number
        _joinData: {
            id: number
            host_id: number
            container_id: number
        }
    }[]
}


