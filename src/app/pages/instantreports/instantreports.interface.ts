import { InstantreportEvaluationTypes, InstantreportFormats, InstantreportObjectTypes } from './instantreports.enums';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { DateTime } from 'luxon';
import { ChartAbsolutValue, PieChartMetric } from '../../components/charts/charts.interface';

/**********************
 *    Index action    *
 **********************/
export interface InstantreportsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Instantreports.name]': '',
    'filter[Instantreports.evaluation][]': InstantreportEvaluationTypes[] | string[]
    'filter[Instantreports.type][]': InstantreportObjectTypes[] | string[]
}

export function getDefaultInstantreportsIndexParams(): InstantreportsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Instantreports.name',
        page: 1,
        direction: 'asc',
        'filter[Instantreports.name]': '',
        'filter[Instantreports.evaluation][]': [],
        'filter[Instantreports.type][]': []
    }
}

export type InstantreportsIndexObjectTypesFilter = {
    [key in InstantreportObjectTypes]: boolean
}

export type InstantreportEvaluationTypesFilter = {
    [key in InstantreportEvaluationTypes]: boolean
}

export function getDefaultInstantreportsIndexObjectTypesFilter(): InstantreportsIndexObjectTypesFilter {
    return {
        [InstantreportObjectTypes.Hostgroups]: false,
        [InstantreportObjectTypes.Hosts]: false,
        [InstantreportObjectTypes.Servicegroups]: false,
        [InstantreportObjectTypes.Services]: false,
    }
}

export function getDefaultInstantreportEvaluationTypesFilter(): InstantreportEvaluationTypesFilter {
    return {
        [InstantreportEvaluationTypes.Hosts]: false,
        [InstantreportEvaluationTypes.HostAndServices]: false,
        [InstantreportEvaluationTypes.Services]: false,
    }
}

export interface InstantreportsIndexRoot extends PaginateOrScroll {
    instantreports: InstantreportIndex[];
    _csrfToken: string
}

export interface InstantreportIndex {
    Instantreport: {
        id: number
        container_id: number
        name: string
        evaluation: number
        type: number
        reflection: number
        downtimes: number
        summary: number
        send_email: number
        send_interval: number
    },
    Timeperiod: {
        id: number
        name: string
    },
    User: InstantreportUser[],
    allowEdit: boolean
}

export interface InstantreportUser {
    id: number
    firstname: string
    lastname: string
    _joinData: {
        id: number
        instantreport_id: number
        user_id: number
    }
}

/**********************
 *    Add action    *
 **********************/
export interface InstantreportPost {
    id?: number,
    container_id: number,
    name: string,
    type: InstantreportObjectTypes, // 1 - host groups, 2 - hosts, 3 - service groups, 4 - services
    timeperiod_id: number,
    reflection: number,// 1 - soft and hard states, 2 - only hard states
    summary: number,
    downtimes: number,
    send_email: number,
    send_interval: number, // 0 - NEVER
    evaluation: InstantreportEvaluationTypes,
    hostgroups: {
        _ids: number[]
    },
    hosts: {
        _ids: number[]
    },
    servicegroups: {
        _ids: number[]
    },
    services: {
        _ids: number[]
    },
    users: {
        _ids: number[]
    },
    created?: string
    modified?: string
}

/**********************
 *  Generate action   *
 **********************/
export interface InstantreportGenerateParams {
    instantreport_id: number,
    report_format: InstantreportFormats
    from_date: string
    to_date: string
}

export function getDefaultInstantreportGenerateParams(): InstantreportGenerateParams {
    const now = DateTime.now();

    return {
        instantreport_id: 0,
        report_format: InstantreportFormats.HTML,
        from_date: now.minus({months: 1}).toFormat('yyyy-MM-dd'),
        to_date: now.toFormat('yyyy-MM-dd')
    }
}

export interface InstantreportsReportPdfParams {
    'angular': true,
    'data[instantreport_id]': number,
    'data[from_date]': string,
    'data[to_date]': string
}

export interface InstantreportsReportHtmlParams {
    instantreport_id: number,
    report_format: InstantreportFormats.HTML
    from_date: string,
    to_date: string
}


export interface InstantreportGenerateResponse {
    instantReport: {
        hosts: {
            [key: string]: {
                Host: InstantreportHost,
            }
        },
        reportDetails: InstantreportReportDetails
    }
    _csrfToken: string
}

export interface InstantreportHost {
    id: number,
    name: string,
    reportData?: InstantreportHostReportData,
    _pieChartMetrics?: PieChartMetric[] // this is only for the eCharts pie chart and not returned by the server
    Services: {
        [key: string]: InstantreportService
    },
}

export interface InstantreportService {
    Service: {
        name: string,
        id: number,
        reportData: InstantreportServiceReportData
        _chartAbsolutValues?: ChartAbsolutValue[] // this is only for the eCharts pie chart and not returned by the server
    }
}

export interface InstantreportHostReportData {
    "0": number,
    "1": number, // duration in seconds
    "2": number, // duration in seconds
    "percentage": string[] // "Up (75.916%)", "Down (0%)", "Unreachable (24.084%)"
}

export interface InstantreportServiceReportData {
    "0": number // duration in seconds
    "1": number // duration in seconds
    "2": number // duration in seconds
    "3": number // duration in seconds
    "percentage": string[] //  "Ok (100%)", "Warning (0%)", "Critical (0%)", "Unknown (0%)"
}

export interface InstantreportReportDetails {
    name: string,
    evaluation: InstantreportEvaluationTypes,
    type: InstantreportObjectTypes,
    summary: number // 0 or 1
    totalTime: number// time in seconds e.g2602774,
    from: string // "00:00:00 - 01.08.2024",
    to: string // "23:59:59 - 01.10.2024",
    summary_hosts?: {
        reportData: InstantreportHostReportData
    }
    summary_services?: {
        reportData: InstantreportServiceReportData
    },
}


/**********************
 *  View HTML Report  *
 **********************/
export interface InstantreportHtmlHostWithServices {
    Host: InstantreportHost,
    Services: InstantreportService[]
}
