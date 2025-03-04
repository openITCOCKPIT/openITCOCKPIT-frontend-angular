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
    _csrfToken: any
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
        direction: 'asc',
        page: 1,
        scroll: true,
        sort: 'SatelliteTasks.id',
        'filter[SatelliteTasks.task]': '',
        'filter[Satellites.name]': '',
        'filter[SatelliteTasks.status][]': []
    }
}

// INDEX
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

// ADD
export interface Root {
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
