import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { GenericIdResponse, GenericValidationError } from '../../generic-responses';
import { GenericIdAndName } from '../../generic.interfaces';

export interface TimeperiodsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Timeperiods.id][]': number[],
    'filter[Timeperiods.name]': string
    'filter[Timeperiods.description]': string
}

export function getDefaultTimeperiodsIndexParams(): TimeperiodsIndexParams {
    return {
        'angular': true,
        'scroll': true,
        'sort': 'Timeperiods.name',
        'page': 1,
        'direction': 'asc',
        'filter[Timeperiods.id][]': [],
        'filter[Timeperiods.name]': "",
        'filter[Timeperiods.description]': ""
    }
}

export interface TimeperiodIndexRoot extends PaginateOrScroll {
    all_timeperiods: TimeperiodIndex[]
    _csrfToken: string
}

/**********************
 *    Index action    *
 **********************/

export interface TimeperiodIndex {
    Timeperiod: {
        id: number,
        uuid: string,
        container_id: number,
        name: string,
        description: string,
        calendar_id: number,
        created: string,
        modified: string,
        allow_edit: boolean
    }
}

/***************************
 *    Add / Edit action    *
 ***************************/

export interface TimeperiodsEditRoot {
    timeperiod: Timeperiod;
    _csrfToken: string;
}

export interface Timeperiod {
    id?: number,
    uuid?: string,
    container_id: number | null,
    name: string,
    calendar_id: number | null,
    timeperiod_timeranges: TimeperiodRange[],
    validate_timeranges: true,
    description: string
}

export interface TimeperiodRange {
    day: '1' | '2' | '3' | '4' | '5' | '6' | '7'
    start: string,
    end: string,
    timeperiod_id?: number,
    id?: number | null,
    weekday?: string
}

export interface InternalRange {
    id: number | null,
    day: '1' | '2' | '3' | '4' | '5' | '6' | '7'
    start: string,
    end: string,
    index: number
}

export interface TimeperiodAddResponse extends GenericIdResponse {
    timeperiod: Timeperiod
}

/**********************
 *     Copy action    *
 **********************/

export interface TimeperiodCopyGet {
    Timeperiod: {
        id: number
        name: string,
        description: string
    }
}

export interface TimeperiodCopyPost {
    Source: GenericIdAndName
    Timeperiod: TimeperiodCopy
    Error: GenericValidationError | null
}

export interface TimeperiodCopy {
    id?: number,
    name: string
    description: string
}

/**********************
 *   Used By action   *
 **********************/

export interface TimeperiodUsedBy {
    timeperiod: TimeperiodUsedByTimeperiod
    objects: TimeperiodUsedByObjects
    total: number
    _csrfToken: string
}

export interface TimeperiodUsedByTimeperiod {
    id: number
    uuid: string
    container_id: number
    name: string
    description: string
    calendar_id: number
    created: string
    modified: string
}


export interface TimeperiodUsedByObjects {
    Contacts: GenericIdAndName[]
    Hostdependencies: GenericIdResponse[]
    Hostescalations: GenericIdResponse[]
    Hosts: GenericIdAndName[]
    Hosttemplates: GenericIdAndName[]
    Instantreports: GenericIdAndName[]
    Servicedependencies: GenericIdResponse[]
    Serviceescalations: GenericIdResponse[]
    Services: TimeperiodUsedByService[]
    Servicetemplates: GenericIdAndName[]
    Autoreports: GenericIdAndName[]
}


export interface TimeperiodUsedByService {
    id: number
    servicename: string
    _matchingData: TimeperiodUsedByMatchingData
}

export interface TimeperiodUsedByMatchingData {
    Hosts: GenericIdAndName
    Servicetemplates: GenericIdAndName
}


/************************
 *  view Details action *
 ************************/

export interface ViewDetailsTimeperiodRoot {
    timeperiod: ViewDetailsTimeperiod
    _csrfToken: string
}

export interface ViewDetailsTimeperiod {
    id: number
    uuid: string
    container_id: number
    name: string
    description: string
    calendar_id: number
    created: string
    modified: string
    timeperiod_timeranges: TimeperiodTimerange[]
    events: Event[]
}

export interface TimeperiodTimerange {
    id: number
    timeperiod_id: number
    day: number
    start: string
    end: string
}

export interface Event {
    daysOfWeek: number[]
    startTime?: string
    endTime?: string
    title?: string
    rendering?: string
    className?: string
    allDay?: boolean
    overLap?: boolean
}

export interface TimeperiodEnity {
    id: number
    uuid: string
    container_id: number
    name: string
    description: string
    calendar_id: number
    created: string
    modified: string
}
