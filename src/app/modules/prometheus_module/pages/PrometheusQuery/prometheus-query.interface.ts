import { ServiceEntity } from '../../../../pages/services/services.interface';
import { Datasource } from '../../../../components/popover-graph/popover-graph.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { GenericValidationError } from '../../../../generic-responses';

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
    warning_max: number | null
    critical_min: number
    critical_max: number | null
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
    promql: string,
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
    success: boolean
    data: GenericValidationError
    metricValue: {
        status: string
        data: {
            resultType: string
            result: Ramsch[]
        }
    }
}

export interface Ramsch {
    metric: {
        __name__: string
        domain: string
        entity: string
        friendly_name: string
        instance: string
        job: string
        service: string
        uuid: string
    }
    value: [number, string]
}

// LOAD CURRENT VALUE BY METRIC
export interface LoadCurrentValueByMetricRoot {
    metricDetails: {
        // status: string
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

// VALIDATE SERVICE
export interface ValidateServiceRoot {
    Service: ValidateService
}

export interface ValidateService extends PrometheusAlertRule {
    longer_as: string
    name: string
    servicetemplate_id: number
}


// CREATE SERVICE
export interface PrometheusCreateServiceRoot {
    Service: PrometheusCreateService
}

export interface PrometheusCreateService {
    host_id: string
    name: string
    prometheus_alert_rule: EditablePrometheusAlertRule
    servicetemplate_id: number
}

export interface PrometheusAlertRule2 {
    id: number
    host_id: number
    promql: string
    unit: string
    threshold_type: string
    warning_min: number
    warning_max: number | null
    critical_min: number
    critical_max: number | null
    warning_longer_as: string
    critical_longer_as: string
    warning_operator: string
    critical_operator: string
    servicetemplate_id: number
}

// EDIT SERVICE
export interface PrometheusEditServiceRoot {
    postData: PrometheusEditService
    servicetemplates: SelectKeyValue[]
    host: Host
    selectedMetrics: string[]
    _csrfToken: any
}

export interface PrometheusEditService {
    Service: {
        id: number
        host_id: number
        servicetemplate_id: number
        name: string
        prometheus_alert_rule: EditablePrometheusAlertRule
    }
}


export interface EditablePrometheusAlertRule extends PrometheusAlertRule {
    servicetemplate_id: number
}

export interface Host {
    id: number
    uuid: string
    name: string
    container_id: number
}

