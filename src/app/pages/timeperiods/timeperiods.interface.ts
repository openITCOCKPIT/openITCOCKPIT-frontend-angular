import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { GenericIdResponse, GenericValidationError } from '../../generic-responses';

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
    day: '1'|'2'|'3'|'4'|'5'|'6'|'7'
    start: string,
    end: string,
    timeperiod_id?: number,
    id?: number | null,
    weekday?: string
}

export interface InternalRange {
    id: number | null,
    day: '1'|'2'|'3'|'4'|'5'|'6'|'7'
    start: string,
    end: string,
    index: number
}

export interface Container {
    key: number,
    value: string
}

export interface Calendar {
    key: number,
    value: string
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
    Source: SourceTimeperiod
    Timeperiod: TimeperiodCopy
    Error: GenericValidationError | null
}

export interface SourceTimeperiod {
    id: number
    name: string
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
    Contacts: TimeperiodUsedByContact[]
    Hostdependencies: TimeperiodUsedByHostdependency[]
    Hostescalations: TimeperiodUsedByHostescalation[]
    Hosts: TimeperiodUsedByHost[]
    Hosttemplates: TimeperiodUsedByHosttemplate[]
    Instantreports: TimeperiodUsedByInstantreport[]
    Servicedependencies: TimeperiodUsedByServicedependency[]
    Serviceescalations: TimeperiodUsedByServiceescalation[]
    Services: TimeperiodUsedByService[]
    Servicetemplates: TimeperiodUsedByServicetemplate[]
    Autoreports: TimeperiodUsedByAutoreport[]
}

export interface TimeperiodUsedByContact {
    id: number
    name: string
    containers: TimeperiodUsedByContainer[]
}

export interface TimeperiodUsedByContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
    _joinData: TimeperiodUsedByJoinData
}

export interface TimeperiodUsedByJoinData {
    id: number
    contact_id: number
    container_id: number
}

export interface TimeperiodUsedByHosttemplate {
    id: number
    name: string
}

export interface TimeperiodUsedByServicetemplate {
    id: number
    name: string
}

export interface TimeperiodUsedByHost {
    id: number
    name: string
}

export interface TimeperiodUsedByHostdependency {
    id: number
}

export interface TimeperiodUsedByHostescalation {
    id: number
}

export interface TimeperiodUsedByServicedependency {
    id: number
}

export interface TimeperiodUsedByServiceescalation {
    id: number
}

export interface TimeperiodUsedByInstantreport {
    id: number
    name: string
}

export interface TimeperiodUsedByAutoreport {
    id: number
    name: string
}

export interface TimeperiodUsedByService {
    id: number
    servicename: string
    _matchingData: TimeperiodUsedByMatchingData
}

export interface TimeperiodUsedByMatchingData {
    Hosts: TimeperiodUsedByHosts
    Servicetemplates: TimeperiodUsedByServicetemplates
}

export interface TimeperiodUsedByHosts {
    id: number
    name: string
}

export interface TimeperiodUsedByServicetemplates {
    id: number
    name: string
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

export interface UserRoot {
    user: User
    isLdapUser: boolean
    maxUploadLimit: MaxUploadLimit
    newDesktopApi: boolean
    oitcVersion: string
    _csrfToken: string
}

export interface User {
    id: number
    usergroup_id: number
    email: string
    firstname: string
    lastname: string
    position: any
    company: any
    phone: any
    timezone: string
    i18n: string
    dateformat: string
    samaccountname: any
    ldap_dn: any
    showstatsinmenu: number
    is_active: number
    dashboard_tab_rotation: number
    paginatorlength: number
    recursive_browser: number
    image: any
    is_oauth: boolean
    usercontainerroles_ldap: UsercontainerrolesLdap
}

export interface UsercontainerrolesLdap {
    _ids: any[]
}

export interface MaxUploadLimit {
    value: number
    unit: string
    string: string
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
