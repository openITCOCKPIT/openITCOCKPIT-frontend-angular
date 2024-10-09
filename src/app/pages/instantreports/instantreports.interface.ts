import { InstantreportEvaluationTypes, InstantreportObjectTypes } from './instantreports.enums';
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

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


