/**********************
 *     Global action    *
 **********************/
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import {
    ContainerSystemdowntimesParams,
    Systemdowntime, SystemdowntimeNodeIndexRoot
} from '../../../../pages/systemdowntimes/systemdowntimes.interface';
import { map, Observable } from 'rxjs';

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
