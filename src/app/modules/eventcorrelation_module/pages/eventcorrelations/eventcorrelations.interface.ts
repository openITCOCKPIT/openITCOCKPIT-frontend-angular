import { ServicestatusObject } from '../../../../pages/services/services.interface';
import { EventcorrelationOperators } from './eventcorrelations.enum';

export interface EventcorrelationsViewRoot {
    evcTree: EvcTree[]
    rootElement: EventcorrelationRootElement
    stateForDisabledService: number
    stateForDowntimedService: number
    showInfoForDisabledService: number
    disabledServices: number
    downtimedServices: number
    hasWritePermission: boolean
    _csrfToken: string | null
}


export interface EvcTree {
    [key: string]: {
        id: number
        parent_id: number
        host_id: number
        service_id: number
        operator: EventcorrelationOperators | null,
        service: EvcService
    }[]
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
    id: number
    servicetemplate_id: number
    host_id: number
    name?: string
    description: any
    service_type: number
    uuid: string
    disabled: number
    host: {
        id: number
        name: string
    }
    servicetemplate: {
        id: number
        name: string
        description: string
    }
    servicename: string
    servicestatus: ServicestatusObject
}
