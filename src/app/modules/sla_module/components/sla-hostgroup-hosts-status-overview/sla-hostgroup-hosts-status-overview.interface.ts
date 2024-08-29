import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

export interface SlaHostgroupHostsStatusOverviewParams {
    angular: true,
    'filter[Hosts.name]': string,
    'filter[Hosts.container_id][]': number[],
    'filter[determined_availability][]': number[],
}

export function getDefaultSlaHostgroupHostsStatusOverviewParams(): SlaHostgroupHostsStatusOverviewParams {
    return {
        angular: true,
        'filter[Hosts.name]': '',
        'filter[Hosts.container_id][]': [],
        'filter[determined_availability][]': [],
    }
}

export interface SlaHostgroupHostsStatusOverviewRoot {
    hostsNotAvailable: HostsNotAvailable
    hostsNotInSla: HostsNotInSla
    slaStatusOverview: SlaStatusOverview[]
    heatmapData: HeatmapData
    _csrfToken: any
}

export interface HostsNotAvailable {
    count: number
    ids: any[]
}

export interface HostsNotInSla {
    count: number
    ids: any[]
}

export interface SlaStatusOverview {
    host_id: number
    host_name: string
    sla_name: string
    determined_availability_percent: number
    minimal_availability: number
    heatmapValue: number
    heatmapPercentageValueForBackground: number
    heatmapLabel: string
}

export interface HeatmapData {
    rows: number
    columns: number
    legendLabelFailed: string
    legendLabelPassed: string
    legendCsvHeader: string
}

export interface LoadContainersRoot {
    containers: SelectKeyValue[]
    _csrfToken: string
}


