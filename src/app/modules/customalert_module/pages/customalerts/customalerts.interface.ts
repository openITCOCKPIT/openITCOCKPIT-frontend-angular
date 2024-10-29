// Get custom alerts
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

export interface CustomAlertsIndex extends PaginateOrScroll {
    customalerts: Customalert[]
    customalertStateOverview: number[]
    customalertGlobalOverview: {
        "0": number
        "1": number
        total: number
    }
    _csrfToken: any
}

export interface Customalert {
    id: number
    message: string
    state: number
    latest_comment_id: any
    service_id: number
    created: string
    modified: string
    servicename: string
    container: string
    primary_container?: string
    service: Service
    CustomalertComments: {
        comment: any
        entry_time: any
    }
    Servicetemplates:  {
        id: number
    }
    _matchingData: {
        Services: {
            id: number
            host_id: number
            disabled: number
        }
        Hosts: {
            id: number
            name: string
        }
    }
    allow_edit: boolean
    createdInHumanShort: string
    modifiedInHumanShort: string
    last24hoursAlerts: number
}

export interface Service {
    id: number
    host_id: number
    disabled: number
    container: string
    primary_container?: string
    servicetemplate: {
        id: number
    }
    host: {
        id: number
        name: string
        container: string
        primary_container?: string
    }
    _matchingData: {
        Hosts: {
            id: number
            name: string
        }
    }
}

// Index Params
export interface CustomAlertsIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc

    'recursive': boolean,
    'filter[Customalerts.message]' : string,
    'filter[Customalerts.state][]' : number[],
    'filter[from]' : string,
    'filter[to]' : string,

}

export function getDefaultCustomAlertsIndexParams(): CustomAlertsIndexParams
{
    return {
        angular: true,
        scroll: true,
        sort: 'Containers.name',
        page: 1,
        direction: 'asc',
        'recursive': false,
        'filter[Customalerts.message]' : '',
        'filter[Customalerts.state][]' : [],
        'filter[from]' : '',
        'filter[to]' : '',
    }
}