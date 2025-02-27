import { PerfParams } from '../../../../components/popover-graph/popover-graph.interface';
import { HostForMapItem, ServiceForMapItem } from '../map-item-base/map-item-base.interface';

export interface GraphItemParams {
    angular: true,
    disableGlobalLoader: true,
    serviceId: number,
    type: string
}

export interface PerfdataParams extends PerfParams {
    disableGlobalLoader: true
}

export interface GraphItemRoot {
    allowView: boolean
    host: HostForMapItem
    service: ServiceForMapItem
    _csrfToken: string
}
