import { Edge, Node } from 'vis-network';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

/**********************
 *    Index action    *
 **********************/
export interface StatusmapsIndexParmas {
    angular: true,
    'filter[Hosts.name]': string
    'filter[Hosts.address]': string
    'filter[Hosts.satellite_id]': number
    'showAll': boolean
}

export function getDefaultStatusmapsIndexParams(): StatusmapsIndexParmas {
    return {
        angular: true,
        'filter[Hosts.name]': "",
        'filter[Hosts.address]': "",
        'filter[Hosts.satellite_id]': 0,
        'showAll': false
    }
}

export interface StatusmapsIndexRootResult {
    statusMap: {
        nodes: StatusmapExtendedNode[]
        edges: Edge[]
    },
    hasBrowserRights: boolean,
    satellites: SelectKeyValue[],
    _csrfToken: string
}

export interface StatusmapExtendedNode extends Node {
    hostId: number,
    uuid: string
}
