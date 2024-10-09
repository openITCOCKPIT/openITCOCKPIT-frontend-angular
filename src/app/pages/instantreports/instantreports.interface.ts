import { InstantreportEvaluationTypes, InstantreportObjectTypes } from './instantreports.enums';

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
