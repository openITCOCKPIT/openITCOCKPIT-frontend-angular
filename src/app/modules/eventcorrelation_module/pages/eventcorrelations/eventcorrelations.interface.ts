import { ServiceEntity, ServiceObject, ServicestatusObject } from '../../../../pages/services/services.interface';
import { EventcorrelationOperators } from './eventcorrelations.enum';
import { HostEntity, HostObject, HoststatusObject } from '../../../../pages/hosts/hosts.interface';
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';


/**********************
 *    Index action    *
 **********************/
export interface EventcorrelationsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string
    'filter[Hosts.description]': string
}

export function getDefaultEventcorrelationsIndexParams(): EventcorrelationsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': '',
        'filter[Hosts.description]': ''
    }
}

export interface EventcorrelationsIndexRoot extends PaginateOrScroll {
    all_evc_hosts: EvcIndexHost[]
    _csrfToken: string | null
}

export interface EvcIndexHost {
    Host: {
        id: number
        uuid: string
        name: string
        description: any
        active_checks_enabled: any
        address: string
        satellite_id: number
        container_id: number
        tags: any
        disabled: number,
        hosts_to_containers_sharing: HostsToContainersSharing[]
    }
    hasViewPermission: boolean
    hasWritePermission: boolean
}

export interface HostsToContainersSharing {
    id: number
    containertype_id: number
    name: string
    parent_id: any
    lft: number
    rght: number
    _joinData: {
        id: number
        host_id: number
        container_id: number
    }
}

/**********************
 *    View action     *
 **********************/
export interface EventcorrelationsViewRoot {
    evcTree: EvcTree[] // Used to render the tree chart
    rootElement: EventcorrelationRootElement,
    evcSummaryTree: EvcSummaryService[][],  // used to render the table based summary
    stateForDisabledService: number
    stateForDowntimedService: number
    showInfoForDisabledService: number
    disabledServices: number
    downtimedServices: number
    hasWritePermission: boolean
    animated: number
    connectionLine: string
    _csrfToken: string | null
}


export interface EvcTree {
    // Hashmap of EvcTreeItem arrays
    [key: string]: EvcTreeItem[]
}

export interface EvcTreeItem {
    id: number | string // string in editCorrelation for new items "ui-id-f9fbdaab-70d1-4af1-a571-14d20b5657fa_1"
    parent_id: null | number | string // string in editCorrelation for new items "ui-id-f9fbdaab-70d1-4af1-a571-14d20b5657f"
    host_id: number
    service_id: number | string // new created vServices "ui-id-780d1d4d-e90d-4cf4-aa09-e344bdaa04d5_vService"
    operator: EventcorrelationOperators | string | null // min1, min10, min300
    operator_warning_min: number | null
    operator_warning_max: number | null
    operator_critical_min: number | null
    operator_critical_max: number | null
    operator_unknown_min: number | null
    operator_unknown_max: number | null
    score_warning: number | null
    score_critical: number | null
    score_unknown: number | null

    service: EvcService,
    usedBy?: string[], //editCorrelation only
}

export interface EventcorrelationRootElement {
    id: number
    parent_id: number | null
    lft: number
    rght: number
    host_id: number
    service_id: number
    operator: EventcorrelationOperators | null
    host: {
        id: number
        name: string
        uuid: string
        container_id: number
    }
}

export interface EvcService {
    id: number | string // new created vServices "ui-id-780d1d4d-e90d-4cf4-aa09-e344bdaa04d5_vService"
    servicetemplate_id: number
    host_id: number
    name?: string | null
    description: any
    service_type: number
    uuid: string | null // null for new created vServices
    disabled: number
    host: {
        id: number
        name: string
    }
    servicetemplate?: {
        id: number
        name: string
        description: string
    }
    servicename: string
    servicestatus: ServicestatusObject
}

export interface EvcServicestatusToast {
    host: HostObject,
    service: ServiceObject,
    servicestatus: ServicestatusObject,
    hoststatus: HoststatusObject,
    _csrfToken: string | null
}

export interface EvcSummaryService {
    serviceId: number
    hostName: string
    serviceName: string
    uuid: string
    operator: EventcorrelationOperators | null
    scheduledDowntimeDepth: number | null
    problemHasBeenAcknowledged: boolean
    current_state: number | null
    disabled: number
    serviceCounter: number,
    modified_state?: number
}

export interface EvcHostUsedBy extends HostEntity {
    usedBy: {
        // Hashmap ob objects
        [key: number]: EvcUsedByEntity
    }
}

export interface HostUsedByEVC {
    host: HostEntity,
    eventcorrelations: UsedByEvcObject[]
}

export interface ServiceUsedByEVC {
    service: ServiceEntity,
    eventcorrelations: UsedByEvcObject[]
}

export interface UsedByEvcObject {
    Hosts: {
        id: number
        name: string
        description?: string
        container_id: number
    }
    hasViewPermission: boolean
    hasWritePermission: boolean
}


export interface EvcUsedByEntity {
    id: number
    name: string
    description?: string,
    Services: {
        id: number
        name: string
        service_type: number
        host_id: number
    },
    Eventcorrelations: {
        service_id: number
        host_id: number
    },
    EvcHosts: {
        id: number
        name: string
        description?: string
        container_id: number
        hasViewPermission: boolean
        hasWritePermission: boolean
    }
}

/*********************************
 *    editCorrelation action     *
 ********************************/
export interface EventcorrelationsEditCorrelationRoot {
    evcTree: EvcTree[] // Used to render the tree chart
    rootElement: EventcorrelationRootElement,
    servicetemplates: SelectKeyValue[],
    stateForDisabledService: number,
    stateForDowntimedService: number,
    showInfoForDisabledService: number,
    animated: number,
    connectionLine: string,
    disabledServices: number,
    downtimedServices: number,
    _csrfToken: string | null
}


export interface EvcModalService {
    servicename: string
    servicetemplate_id: number
    service_ids: (number | string)[] // 1 or 2_vService
    operator: EventcorrelationOperators | null
    operator_modifier: number
    operator_warning_min: number | null
    operator_warning_max: number | null
    operator_critical_min: number | null
    operator_critical_max: number | null
    operator_unknown_min: number | null
    operator_unknown_max: number | null
    score_warning: number | null
    score_critical: number | null
    score_unknown: number | null
    current_evc: {
        id: number
        layerIndex: number
        mode: EvcVServiceModalMode
        evc_node_id?: string | number // edit only
        old_service_ids?: (number | string)[] // edit only // 1 or 2_vService
    }
}

export function getDefaultEvcModalService(evcId: number, layerIndex: number): EvcModalService {
    return {
        servicename: '',
        servicetemplate_id: 0,
        service_ids: [],
        operator: null,
        operator_modifier: 0,
        operator_warning_min: null,
        operator_warning_max: null,
        operator_critical_min: null,
        operator_critical_max: null,
        operator_unknown_min: null,
        operator_unknown_max: null,
        score_warning: null,
        score_critical: null,
        score_unknown: null,
        current_evc: {
            id: evcId,
            layerIndex: layerIndex,
            mode: 'add'
        }
    }
}

export interface EvcServiceSelect {
    key: number | string,
    value: {
        Service: {
            id: number | string
            name?: string | null
            servicename: string
            disabled?: number
        }
        Host: {
            id: number,
            name: string
        }
        Servicetemplate?: {
            name: string
        }
    },
    vServiceInUse?: boolean
}

export type EvcVServiceModalMode = 'add' | 'edit';

export interface EvcToggleModal {
    layerIndex: number,
    mode: EvcVServiceModalMode
    eventCorrelation?: EvcTreeItem
}

export interface EvcDeleteNode {
    layerIndex: number,
    evcNodeId: number | string
}

export interface EvcAddVServiceValidationResult {
    success: boolean,
    // updates."0".uu-id."0" = EvcTreeItem
    updates: {
        // layerIndexToUpdate (0,1,2,etc)
        [key: string]: {
            // newParentIdvService (ui-id-f9fbdaab-70d1-4af1-a571-14d20b5657fa)
            [key: string]: {
                // 0, 1 (just a number)
                [key: string]: EvcTreeItem
            }
        }
    }

}

export interface EvcEditVServiceValidationResult {
    success: boolean,
    // updates."0".uu-id."0" = EvcTreeItem
    services: {
        id: number | string
        parent_id: number | string
        host_id: number
        service_id: number | string
        operator: EventcorrelationOperators | string | null
        operator_warning_min: number | null
        operator_warning_max: number | null
        operator_critical_min: number | null
        operator_critical_max: number | null
        operator_unknown_min: number | null
        operator_unknown_max: number | null
        score_warning: number | null
        score_critical: number | null
        score_unknown: number | null
        service: EvcService
    }[]

}

export interface EvcDeleteNodeDetails {
    id: string,
    parent_id: null | string,
    serviceIndex: null | number,
    parentEvcId: null | string
}
