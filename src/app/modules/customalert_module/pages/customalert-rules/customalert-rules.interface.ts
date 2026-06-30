import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { getUserDate } from '../../../../services/timezone.service';

export interface CustomAlertRulesIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc,
    'filter[CustomalertRules.description]': string,
    'filter[CustomalertRules.name]': string,

    // https://master/customalert_module/customalert_rules/index.json?angular=true&direction=asc&filter%5B%5D=&filter%5B%5D=&page=1&scroll=true&sort=CustomalertRules.name

}

export function getDefaultCustomAlertRulesIndexParams(): CustomAlertRulesIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'CustomalertRules.name',
        page: 1,
        direction: 'asc',
        'filter[CustomalertRules.description]': '',
        'filter[CustomalertRules.name]': ''
        // page=1&scroll=true&sort=CustomalertRules.name
    } as CustomAlertRulesIndexParams
}

export interface CustomAlertRulesIndex extends PaginateOrScroll {
    customalertRules: EditableCustomAlertRule[]
}

export interface CustomAlertRule {
    container_id: number
    description: string
    host_keywords: string
    host_not_keywords: string
    name: string
    recursive: boolean
    service_keywords: string
    service_not_keywords: string
    servicename_regex: string
}

export interface EditableCustomAlertRule extends CustomAlertRule {
    id: number
    created: string
    modified: string
    container: string
    allowEdit: boolean
}

// SERVICES PARAMS
export interface CustomAlertRulesServicesParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc,

    'filter[Hosts.name]': string,
    'filter[servicename]': string
}

export function getDefaultCustomAlertRulesServicesParams(): CustomAlertRulesServicesParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': '',
        'filter[servicename]': ''
    } as CustomAlertRulesServicesParams
}

// SERVICES
export interface CustomAlertRuleServices extends PaginateOrScroll {
    customalertRule: CustomAlertRule
    services: {
        id: number
        servicename: string
        description: any
        Hosts: {
            name: string
            id: number
        }
    }[]
    success: boolean
}

export function getDefaultCustomAlertRulesHistoryParams(): CustomAlertRulesHistoryParams {
    let now: Date = getUserDate();
    return {
        angular: true,
        scroll: true,
        sort: 'CustomalertStatehistory.state_time',
        page: 1,
        direction: 'desc',
        'filter[Hosts.name]': '',
        'filter[servicename]': '',
        'filter[CustomalertComments.comment]': '',
        'filter[CustomalertStatehistory.state][]': [],
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 1000 * 30)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5)),
    }
}

export interface CustomAlertRulesHistoryParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc,
    'filter[from]': Date | string,
    'filter[to]': Date | string,
    'filter[CustomalertComments.comment]': string,
    'filter[CustomalertStatehistory.state][]': number[],
    'filter[Hosts.name]': string,
    'filter[servicename]': string,
}

export interface CustomAlertsStateHistory extends PaginateOrScroll {
    customalertStatehistory: CustomalertStatehistory[]
    _csrfToken: any
}

export interface CustomalertStatehistory {
    id: number
    state: number
    stateTime: string
    stateTimeInHumanShort: string
    stateInHuman: string
    Hosts: {
        id: number
        name: string
    }
    Services: {
        id: number
    }
    servicename: string
    Users: {
        id: number | null
    }
    full_name: string
    "CustomalertComments": {
        "comment": string | null
        "entry_time": string | null
    }
}
