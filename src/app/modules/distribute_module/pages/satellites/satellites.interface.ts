/**********************
 *     Global action    *
 **********************/
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { Systemdowntime } from '../../../../pages/systemdowntimes/systemdowntimes.interface';

export interface SatellitesLoadSatellitesByStringParams {
    'angular': true,
    'filter[Satellites.name]': string
}


/**
 * System downtimes Satellite list
 */

export interface SystemdowntimeSatelliteIndexRoot extends PaginateOrScroll {
    all_satellite_recurring_downtimes: SatelliteSystemdowntime[]
    _csrfToken: string
}

export interface SatelliteSystemdowntime {
    Satellite: SystemdowntimeSatellite
    Systemdowntime: Systemdowntime
}

export interface SystemdowntimeSatellite {
    name: string
    allow_edit: boolean
}

export interface SatelliteSystemdowntimesParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Systemdowntimes.author]': '',
    'filter[Systemdowntimes.comment]': '',
    'filter[Satellites.name]': ''
}

export function getDefaultSatelliteSystemdowntimesParams(): SatelliteSystemdowntimesParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Systemdowntimes.from_time',
        page: 1,
        direction: 'desc',
        'filter[Systemdowntimes.author]': '',
        'filter[Systemdowntimes.comment]': '',
        'filter[Satellites.name]': ''
    }
}

/*************************
 * Host / Service Browser *
 *************************/
export interface SatelliteEntity extends IndexSatellite {
    id: number
    sync_instance: number
    created: string
    modified: string
    nsta_sync_instance: number
}

export interface SatelliteEntityCake2 {
    Satellite: SatelliteEntity
}

export interface SatelliteEntityWithSatelliteStatus extends SatelliteEntity {
    satellite_status: SatelliteStatus
}

export interface SatelliteStatus {
    id: number
    status: number
    last_error: string
    last_export?: string
    last_seen: string
    satellite_id: number
    last_error_time: any
    status_human: string
}

// TASKS: INDEX
export interface SatelliteTasksIndex extends PaginateOrScroll {
    all_satellite_tasks: AllSatelliteTask[]
}

export interface AllSatelliteTask {
    id: number
    satellite_id: number
    task: string
    status: number
    result: any
    error: any
    modified: string
    created: string
    satellite: Satellite
    status_human: {
        title: string
        class: string
    }
    allow_edit: boolean
}

export interface Satellite {
    id: number
    name: string
    container_id: number
}

// https://master/distribute_module/satellites/tasks.json?angular=true&direction=desc&filter%5BSatelliteTasks.task%5D=&filter%5BSatellites.name%5D=

export interface SatelliteTasksParams {
    angular: true,
    direction: 'asc' | 'desc' | '',
    page: number,
    scroll: boolean,
    sort: string,
    'filter[SatelliteTasks.task]': string,
    'filter[Satellites.name]': string,
    'filter[SatelliteTasks.status][]': number[]
}

export function getDefaultSatelliteTasksParams(): SatelliteTasksParams {
    return {
        angular: true,
        direction: 'desc',
        page: 1,
        scroll: true,
        sort: 'SatelliteTasks.id',
        'filter[SatelliteTasks.task]': '',
        'filter[Satellites.name]': '',
        'filter[SatelliteTasks.status][]': []
    }
}

export interface SatellitesInformationParams {
    direction: 'asc' | 'desc' | '',
    page: number,
    scroll: boolean,
    sort: string,
    'filter[Satellites.name]': string,
    'filter[SatelliteInformation.oitc_version]': string,
    'filter[SatelliteInformation.os_version]': string,
}

export function getDefaultSatellitesInformationParams(): SatellitesInformationParams {
    return {
        direction: 'desc',
        page: 1,
        scroll: true,
        sort: 'Satellites.name',
        'filter[SatelliteInformation.oitc_version]': '',
        'filter[SatelliteInformation.os_version]': '',
        'filter[Satellites.name]': '',
    }
}

// STATUS INDEX
export interface SatelliteStatusIndex extends PaginateOrScroll {
    all_satellites: AllSatellite[]
}

export interface AllSatellite {
    id: number
    name: string
    description: any
    address: string
    container_id: number
    timezone: string
    sync_method: string
    status: number
    satellite_status: SatelliteStatus
    container: string
    sync_method_name: string
    allow_edit: boolean
}

// SATELLITE INDEX
export interface SatelliteIndexParams {
    angular: true,
    direction: 'asc' | 'desc' | '',
    page: number,
    scroll: boolean,
    sort: string,

    'filter[Satellites.address]': string,
    'filter[Satellites.name]': string,
    'filter[Satellites.sync_method][]': string[],
    'filter[Satellites.description]': string,
}

export function getDefaultSatelliteIndexParams(): SatelliteIndexParams {
    return {
        angular: true,
        direction: 'asc',
        page: 1,
        scroll: true,
        sort: 'Satellites.name',

        'filter[Satellites.address]': '',
        'filter[Satellites.name]': '',
        'filter[Satellites.sync_method][]': [],
        'filter[Satellites.description]': '',
    }
}

export interface SatelliteIndex extends PaginateOrScroll {
    all_satellites: AllIndexSatellite[]
}

export interface AllIndexSatellite extends AllSatellite {
    sync_instance: number
    created: string
    modified: string
    login: string
    port: number
    private_key_path: string
    url: string
    remote_port: number
    api_key: string
    interval: number
    timeout: number
    use_proxy: number
    proxy_url: string
    verify_certificate: number
    use_timesync: number
    nsta_sync_instance: number
}

// SATELLITE ADD
export interface SatellitesAddRoot {
    frontendUrl: string
    protocol: string
    proxyProtocol: string
    proxyUrl: string
    Satellite: IndexSatellite
}


export interface IndexSatellite {
    address: string
    api_key: string
    container_id: number
    description?: string
    interval: number
    login: string
    name: string
    port: number
    private_key_path: string
    proxy_url: string
    remote_port: number
    sync_method: string
    timeout: number
    timezone: string
    url: string
    use_proxy: number
    use_timesync: number
    verify_certificate: number
}

export interface EditSatelliteRoot {
    satellite: EditableSatellite
    frontendUrl?: string
    protocol?: string
    proxyProtocol?: string
    proxyUrl?: string
}

export interface EditSatellitePostRoot {
    Satellite: EditableSatellite
    frontendUrl?: string
    protocol?: string
    proxyProtocol?: string
    proxyUrl?: string
}

export interface EditableSatellite extends IndexSatellite {
    id: number
}

// USED BY
export interface SatelliteUsedBy {
    satellite: SatelliteUsedBySatellite
    all_hosts: SatelliteUsedByHost[]
    total: number
    _csrfToken: string
}

export interface SatelliteUsedBySatellite {
    id: number
    name: string
}

export interface SatelliteUsedByHost {
    id: number
    name: string
    address: string
    uuid: string
}

// LoadHostsBySatelliteIds
export interface LoadHostsBySatelliteIds {
    hosts: LoadHostsBySatelliteIdsHost[]
}

export interface LoadHostsBySatelliteIdsHost {
    id: number,
    uuid: string
}

// Satellite info
export interface SatellitesStatusParams {
    angular: true,
    direction: 'asc' | 'desc' | '',
    page: number,
    scroll: boolean,
    sort: string,


    'filter[Satellites.address]': string,
    'filter[Satellites.name]': string,
    'filter[Satellites.sync_method][]': string[],
    'filter[status][]': number[],
}

export function getDefaultSatellitesStatusParams(): SatellitesStatusParams {
    return {
        angular: true,
        direction: 'asc',
        page: 1,
        scroll: true,
        sort: 'Satellites.name',


        'filter[Satellites.address]': '',
        'filter[Satellites.name]': '',
        'filter[Satellites.sync_method][]': [],
        'filter[status][]': [],
    } as SatellitesStatusParams;
}

export interface SatelliteInfoIndex extends PaginateOrScroll {
    all_satellite_information: AllSatelliteInformation[]
}

export interface AllSatelliteInformation {
    id: number
    satellite_id: string
    oitc_version: string
    os_version: string
    php_version: string
    number_of_hosts: number
    number_of_services: number
    system_health: string
    modified: string
    created: string
    satellite: Satellite
    last_update: string
    system_health_json: SatelliteSystemHealthJson
    allow_edit: boolean
}

export interface SatelliteSystemHealthJson {
    oitc_version: string
    oitc_is_debugging_mode: boolean
    oitc_webinterface_enabled: boolean
    os_version: string
    os_kernel: string
    os_architecture: string
    cpu_processor: string
    cpu_cores: number
    cpu_load1: number
    cpu_load5: number
    cpu_load15: number
    php_version: string
    isContainer: boolean
    LsbRelease: string
    isDebianBased: boolean
    isRhelBased: boolean
    memory: {
        memory: {
            total: number
            used: number
            free: number
            buffers: number
            cached: number
            percentage: number
            state: string
        },
        swap: {
            total: number
            used: number
            free: number
            percentage: number
            state: string
        }
    }
    disks: {
        disk: string
        size: string
        used: string
        avail: string
        use_percentage: number
        mountpoint: string
        state: string
    }[]
    monitoring_engine: string
    naemonstats: {
        NAGIOSVERSION: string
        NAGIOSPID: number
        NUMHOSTS: number
        NUMSERVICES: number
        PROGRUNTIME: string
    }
}
