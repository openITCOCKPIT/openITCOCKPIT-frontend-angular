export interface MapSummaryItemRootParams {
    angular: true,
    disableGlobalLoader: true,
    objectId: number,
    mapId: number,
    type: string
}

export interface MapSummaryItemRoot {
    type: string
    allowView: boolean
    data: Data
    _csrfToken: string
}

export interface Data {
    BitMaskHostState: number
    BitMaskServiceState: number
    Host: Host
    Service: Service
    Hostgroup: Hostgroup
    Servicegroup: Servicegroup
    Map: Map
}

export interface Host {
    id: number
    uuid: string
    hostname: string
    address: string
    description: any
    hosttemplate_id: number
    active_checks_enabled: any
    satelliteId: number
    containerId: number
    containerIds: number[]
    tags: any
    usageFlag: number
    allow_edit: boolean
    disabled: boolean
    priority: any
    notes: any
    is_satellite_host: boolean
    name: string
}

export interface Service {
    id: number
    uuid: string
    servicename: string
    hostname: string
    description: string
    active_checks_enabled: boolean
    tags: any
    host_id: number
    usageFlag: number
    allow_edit: boolean
    disabled: boolean
    serviceType: number
    priority: number
}

export interface Hostgroup {
    id: number
    name: string
    description: string
}

export interface Servicegroup {
    id: number
    name: string
    description: string
}

export interface Map {
    id: number
    name: string
    title: string
    background: string
    refresh_interval: number
    json_data: string
    created: string
    modified: string
    containers: Container[]
}

export interface Container {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
    _joinData: JoinData
}

export interface JoinData {
    id: number
    container_id: number
    map_id: number
}
