// https://master/prometheus_module/PrometheusAlertRules/index.json?angular=true&direction=asc&filter%5BPrometheusAlertRules.host_id%5D=130&filter%5BPrometheusAlertRules.promql%5D=b&filter%5Bservicename%5D=a&page=1&scroll=true&sort=servicename
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { PrometheusAlertRule } from '../PrometheusQuery/prometheus-query.interface';

export interface PrometheusAlertRulesIndexParams {
    angular: boolean
    direction: 'asc' | 'desc' | '', // asc or desc
    page: number
    scroll: boolean
    sort: string

    'filter[servicename]': string
    'filter[PrometheusAlertRules.promql]': string
    'filter[PrometheusAlertRules.host_id]': number
}

export function getDefaultPrometheusAlertRulesIndexParams(): PrometheusAlertRulesIndexParams {
    return {
        angular: true,
        direction: 'asc', // asc or desc
        page: 0,
        scroll: true,
        sort: 'servicename',
    } as PrometheusAlertRulesIndexParams;
}

export interface PrometheusAlertRulesIndexRoot extends PaginateOrScroll {

    all_alert_rules: AllAlertRule[]

}

export interface AllAlertRule {
    id: number
    host_id: number
    uuid: string
    servicetemplate_id: number
    servicename: string
    container_ids: string
    Hosts: {
        id: number
        name: string
        address: string
        uuid: string
        container_id: number
    }
    _matchingData: {
        PrometheusAlertRules: PrometheusAlertRule
    }
    allow_edit: boolean
}
