import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';



export interface AutoreportsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Autoreports.name]': string,
    'filter[Autoreports.description]': string
}

export interface AutoreportDownloadParams {
    params: {
        'angular': boolean,
        'data[id]': number,
        'data[from_date]': string,
        'data[to_date]': string
    }
    responseType: 'blob'
}

export function getDefaultAutoreportsIndexParams(): AutoreportsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Autoreports.name',
        page: 1,
        direction: 'asc',
        'filter[Autoreports.name]': '',
        'filter[Autoreports.description]': ''
    }
}

export interface AutoreportsIndexRoot extends PaginateOrScroll {
    autoreports: AutoreportIndex[];
    _csrfToken: string
}

export interface AutoreportIndex {
        id: number,
        name: string,
        description: string,
        container_id: number,
        report_interval: string,
        report_send_interval: string,
        min_availability: number | null,
        max_number_of_outages: number | null,
        allowEdit: boolean
}


export interface AutoreportPostObject {
    container_id: number | null,
    name: string | null,
    description: string | null,
    use_start_time: number,
    report_start_date: string | null,
    timeperiod_id: number | null,
    report_interval: string| null,
    report_send_interval: string | null,
    min_availability_percent: boolean,
    min_availability: string | null,
    max_number_of_outages: number | null,
    show_time: string, //SLA Graph - if true -> show availability in hours
    check_hard_state: number, // if true -> consider only hard states from state history
    consider_downtimes: number,
    consider_holidays: number,
    calendar_id: number | null,
    users: {
        _ids: number[]
    }
}

export interface AutoreportPost {
    Autoreport: AutoreportPostObject
}

export function getDefaultPost(): AutoreportPost {
    return {
        Autoreport: {
            container_id: 0,
            name: '',
            description: null,
            use_start_time: 0,
            report_start_date: null,
            timeperiod_id: null,
            report_interval: null,
            report_send_interval: null,
            min_availability_percent: true,
            min_availability: null,
            max_number_of_outages: null,
            show_time: '0', //SLA Graph - if true -> show availability in hours
            check_hard_state: 0, // if true -> consider only hard states from state history
            consider_downtimes: 0,
            consider_holidays: 0,
            calendar_id: null,
            users: {
                _ids: []
            }
        }
    }
}

export interface DynamicHostObject {
    [key: string]: {
        host_id: number,
        percent: number,
        minute: number,
        alias: number,
        outage: string,
        allfailures: number
    }
}




export interface AutoreportObject {
    id?: number,
    name?: string,
    description?: string,
    container_id: number,
    timeperiod_id?: number,
    timeperiod?: AutoreportTimeperiodEnity,
    report_interval?: string,
    report_send_interval?: string,
    consider_downtimes?: boolean,
    last_send_date?: string,
    min_availability_percent?: boolean,
    min_availability?: number | null,
    min_availability_string?: string,
    check_hard_state?: boolean,
    use_start_time?: number,
    report_start_date?: string,
    last_percent_value?: number,
    last_absolut_value?: number,
    show_time: number,
    last_number_of_outages?: number,
    failure_statistic?: number,
    consider_holidays?: number,
    consider_holidays_string?: string,
    calendar_id?: number | null,
    max_number_of_outages?: number | null,
    created?: string
    modified?: string,
    users?: AutoreportUser[],
    hostsWithServices?: AutoReportHostWithServicesObject[],
    POST?: any
}

export interface AtutoreportEditPost{
    autoreport: AutoreportObject,
    selectedHostIds?: number[],
}


export interface AutoreportGet {
    autoreport: AutoreportObject,
    _csrfToken?: string
}

export interface CalendarParams {
    angular: boolean,
    containerId: number,
    'filter[Calendar.name]': string
}

export function getDefaultCalendarParams(): CalendarParams {
    return {
        angular: true,
        containerId: 0,
        'filter[Calendar.name]': ''
    }
}

export interface HostServiceParams {
    angular: true,
    'hostIds[]': number[],
    'servicenameRegex': string | null,
    'selected[]': number[];
}

export interface AutoreportServiceObject {
    id: number,
    host_id: number,
    servicename: string,
    disabled?: number,
    _joinData?: {
        id: number,
        "autoreport_id": number,
        "host_id": number,
        "service_id": number,
        "outage_duration": number,
        "configuration_option": number,
        "graph_settings": string,
        "created": string,
        "modified": string
    }


}

export interface AutoReportHostWithServicesObject {
    id: number,
    name: string,
    _joinData?: {
        id: number,
        autoreport_id: number,
        host_id: number,
        outage_duration: number,
        configuration_option: number,
        created?: string,
        modified?: string
    },
    services: AutoreportServiceObject[]
}


export interface  PostHost {
    host_id: number,
    percent: number,
    minute: number,
    alias: number,
    outage: string,
    allfailures: number
}

export interface PostService {
    host_id: number,
    service_id: number,
    percent: number,
    minute: number,
    graph: number,
    graphSettings: string,
    outage: string,
    allfailures: number
}

export interface PostAutoreport {
    Autoreport: {
        hosts: PostHost[],
        services: PostService[]
    }
}

export interface AutoreportUser {
    id:number,
    firstname: string,
    lastname: string
}

export interface AutoreportTimeperiodEnity {
    id: number
    uuid: string
    container_id: number
    name: string
    description: string
    calendar_id: number
    created: string
    modified: string
    timeperiod_timeranges?: Timerange[]
}

export interface Timerange {
    day: string,
    start: string,
    end: string,
    timeperiod_id?: number,
    id?: number | null,
    weekday?: string
}

export interface ReportError {
    error: boolean
    message: string
    objects: any[]
}


