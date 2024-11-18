import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

export interface CustomAlertRulesIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
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

// ADD
export interface AddCustomAlertRulePost extends EditableCustomAlertRule {
}

// EDIT RESPONSES
export interface EditCustomAlertRule {
    customalertRule: EditableCustomAlertRule
    _csrfToken: any
}

// EDIT POST
export interface EditCustomAlertRulePost extends EditableCustomAlertRule {
}

// SERVICES PARAMS
export interface CustomAlertRulesServicesParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
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

