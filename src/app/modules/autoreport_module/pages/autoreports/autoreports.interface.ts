import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { GenericResponse } from '../../../../generic-responses';
import {Timeperiod} from '../../../../pages/timeperiods/timeperiods.interface';



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
    id: number,
    name: string,
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
    show_time?: number,
    last_number_of_outages?: number,
    failure_statistic?: number,
    consider_holidays?: number,
    consider_holidays_string?: string,
    calendar_id?: number | null,
    max_number_of_outages?: number | null,
    created?: string
    modified?: string,
    allowEdit?: boolean,
    users?: AutoreportUser[],
    hostsWithServices?: AutoReportHostWithServicesObject[],
    POST?: {
        hosts: {
            [key: string]: PostHost
        },
        services: {
            [key: string]: PostService
        }
    }
}

export interface AutoreportEditPost{
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
    objects: ReportErrorObject[]
}

export interface ReportErrorObject {
    name: string,
    services?: string[]
}
export interface AutoreportServiceUsedByResponse {
    service: {
        id: number,
        uuid?: string,
        name: string | null,
        servicename: string | null,
        servicetemplate_id?: number,
        servicetemplate?: any,
        host?:  {
            id: number,
            uuid?: string,
            name: string | null,
            container_id?: number,
            satellite_id?: number,
            hosts_to_containers_sharing?: any[]
        }
    },
    autoreports: AutoreportObject[]
}

export interface AutoreportHostUsedByResponse {
    host:  {
        id: number,
        uuid?: string,
        name: string | null,
        address?: string | null
        container_id?: number,
        satellite_id?: number,
        hosts_to_containers_sharing?: any[]
    },
    autoreports: AutoreportObject[]
}

export interface GenerateResponse extends GenericResponse{
        autoreport: GenerateReport,
        autoreport_data: AutoreportData,
        GraphImageBlobs: GraphImageBlob,
        logoUrl: string
}

export interface GraphImageBlob {
    [key: string]: {
        [key: string]: string[]
    }
}

export interface AutoreportData {
    total_time: number,
    total_outage_time: number,
    lst_number_of_outages: number,
    max_outages_time_in_percent: number,
    max_outages_time_in_seconds: number,
    max_outages_time_in_seconds_human: string,
    total_outage_time_percentage: number,
    total_outage_time_human: string,
    total_outage_count: number,
    outages_filtered: FilteredOutage[],
    sla_graph_path: string,
    settings: {
        configuration_option: number,
    },
    defaultSettings: DefaultSettings,
    evaluation_time: {
        start: number,
        start_human: string,
        end: number,
        end_human: string
    },
    hosts: {
        [key: number]: {
            Host: {
                0: number,
                1: number,
                2: number,
                configuration_option: number
                id: number,
                uuid: string,
                name: string,
                description: string|null,
                outages: FrontendOutage[],
                outage_duration: number|null,
                state_overview: {
                    percent_up: number,
                    percent_down: number,
                    percent_unreachable: number,
                    percent_availability: number,
                    human_up: string,
                    human_down: string,
                    human_unreachable: string,
                },
                downtimes: AutreportDowntime[],
                frontend: {
                    maximum_outage_duration: number,
                    maximum_outage_duration_human: string,
                    show_outages: boolean,
                    outages_headline: string,
                    downtimes: FrontendDowntime[],
                    outages: FrontendOutage[],
                    outages_summarized_in_downtime: FrontendOutage[]
                }
            },
            Services?: {
                [key: number]: {
                    Service: {
                        0: number,
                        1: number,
                        2: number,
                        3: number,
                        configuration_option: number
                        id: number,
                        uuid: string,
                        name: string,
                        description: string|null,
                        outages: FrontendOutage[],
                        outage_duration: number|null,
                        state_overview: {
                            percent_ok: number,
                            percent_warning: number,
                            percent_critical: number,
                            percent_unknown: number,
                            percent_availability: number,
                            human_ok: string,
                            human_warning: string
                            human_critical: string,
                            human_unknown: string,
                        },
                        downtimes: AutreportDowntime[],
                        frontend: {
                            maximum_outage_duration: number,
                            maximum_outage_duration_human: string,
                            show_outages: boolean,
                            outages_headline: string,
                            downtimes: FrontendDowntime[],
                            outages: FrontendOutage[],
                            outages_summarized_in_downtime?: FrontendOutage[]

                        },
                    }
                }
            }
        }

    }
}



export interface DefaultSettings {
    AUTOREPORTS_ERROR_NOTIFICATION: {
        value: string,
        info: string
    },
    AUTOREPORTS_EXTENDED_HOST_DESC: {
        value: number,
        info: string
    },
    AUTOREPORTS_EXTENDED_SERV_DESC: {
        value: number,
        info: string
    },
    AUTOREPORTS_GENERATE_ONLY_FOR_EXISTING: {
        value: number,
        info: string
    },
    AUTOREPORTS_GENERATE_QUARTERLY_REPORTS: {
        value: number,
        info: string
    },
    AUTOREPORTS_SEND_REPORT_AS_CSV: {
        value: number,
        info: string
    },
    AUTOREPORTS_SEND_REPORT_AS_PDF: {
        value: number,
        info: string
    },
    AUTOREPORTS_SHOW_DOWNTIMES: {
        value: number,
        info: string
    },
    AUTOREPORTS_SHOW_OUTAGES_IN_DOWNTIME: {
        value: number,
        info: string
    },
    AUTOREPORTS_SHOW_SLA_GRAPH: {
        value: number,
        info: string
    },
    AUTOREPORTS_SHOW_SUMMARY_STATISTICS: {
        value: number,
        info: string
    },
    AUTOREPORTS_STORE_PATH: {
        value: string,
        info: string
    },
    AUTOREPORTS_TENANT_AS_SUBJECT: {
        value: number,
        info: string
    },
    AUTOREPORTS_USE_CREATE_DATE_IN_FILENAME: {
        value: number,
        info: string
    },
    AUTOREPORTS_USE_YEAR_IN_FILENAME: {
        value: number,
        info: string
    }
}

export interface AutreportDowntime {
    author_name: string
    comment_data: string
    entry_time: string
    scheduled_start_time: string
    scheduled_end_time: string
    duration: number
    was_started: number
    internal_downtime_id: number
    was_cancelled: number
}

export interface FrontendDowntime {
    author_name: string
    comment_data: string
    start: string
    end: string,
    duration_str: string,
}

export interface FrontendOutage {
    start: string
    end: string,
    duration: number,
    duration_str: string,
}

export interface FilteredOutage {
    start: number,
    end: number,
    is_downtime: boolean,
    output: string|null,
    is_hardstate: boolean | null
}

export interface GenerateReport {
    calendar: string|null
    calendar_id: number
    check_hard_state: boolean,
    consider_downtimes: boolean,
    consider_holidays: number,
    id: number,
    container_id: number
    name: string,
    description: string
    failure_statistic: number
    last_absolut_value: number,
    last_number_of_outages: number
    last_percent_value: number
    last_send_date: string|null
    max_number_of_outages: number
    min_availability: number
    min_availability_percent: boolean,
    modified: string,
    created: string,
    report_interval: string
    report_send_interval: string
    report_start_date: string|null
    show_time: number,
    timeperiod_id: number,
    total_time: number,
    use_start_time: number,
    timeperiod: Timeperiod,
    hosts: GenerateReportHost[],
    services: GenerateReportService[]
}

export interface GenerateReportHost {
    id: number,
    last_absolut_value: number
    last_number_of_outages: number,
    uuid: string,
    name: string,
    description: string|null,
    created: string,
    _join_data?: {
        autoreport_id: number,
        configuration_option: number,
        created: string|null
        host_id: number,
        id:number,
        modified: string|null
        outage_duration: number
    }
}

export interface GenerateReportService {
    id: number,
    host_id: number,
    last_absolut_value: number
    last_number_of_outages: number,
    uuid: string,
    name: string|null,
    description: string|null,
    service_type: number,
    service_template_id: number,
    created: string,
    host: {
        created: string,
        description: string|null
        id: number,
        name: string,
        uuid: string,
    },
    servicetemplate: {
        created: string,
        description: string|null
        id: number,
        name: string
        uuid: string
    }
    _join_data?: {
        autoreport_id: number,
        configuration_option: number,
        created: string|null
        host_id: number,
        id:number,
        modified: string|null
        outage_duration: number,
        service_id: number
    }
}
