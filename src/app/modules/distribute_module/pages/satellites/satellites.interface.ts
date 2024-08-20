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
export interface SatelliteEntity {
    id: number
    name: string
    description: string
    address: string
    container_id: number
    sync_instance: number
    timezone: string
    created: string
    modified: string
    sync_method: string
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

export interface SatelliteEntityCake2 {
    Satellite: SatelliteEntity
}
