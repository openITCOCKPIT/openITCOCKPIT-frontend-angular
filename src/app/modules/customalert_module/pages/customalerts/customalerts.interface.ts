// Get custom alerts
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { formatDate } from '@angular/common';

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
    'filter[Hosts.container_id][]' : number[],
    'filter[from]' : string,
    'filter[to]' : string,

}

export interface LoadContainersRoot {
    containers: SelectKeyValue[]
    _csrfToken: string
}

export function getDefaultCustomAlertsIndexParams(): CustomAlertsIndexParams
{
    let now = new Date();
    // From: 30 days ago
    let fromStr: string = formatDate(new Date(now.getTime() - 86400000 * 30), 'yyyy-MM-ddTHH:mm', 'en-US');
    // To: Tomorrow
    let toStr: string = formatDate(new Date(now.getTime()   + 86400000), 'yyyy-MM-ddTHH:mm', 'en-US');
    return {
        angular: true,
        scroll: true,
        sort: 'Customalerts.created',
        page: 1,
        direction: 'desc',
        'recursive': false,
        'filter[Customalerts.message]' : '',
        'filter[Customalerts.state][]' : [],
        'filter[Hosts.container_id][]' : [],
        'filter[from]' : fromStr,
        'filter[to]' : toStr,
    }
}

// ANNOTATE
export interface AnnotateParams {
    setAnnotationAsHostAcknowledgement: boolean
    setAnnotationAsServiceAcknowledgement : boolean
}

export enum CustomAlertsState {
    New = 0,
    InProgress = 1,
    Done = 2,
    ManuallyClosed = 3,
}

export function getDefaultCustomAlertsIndexCustomAlertsStateFilter(): CustomAlertsIndexCustomAlertsStateFilter {
    return {
        [CustomAlertsState.New]: true,
        [CustomAlertsState.InProgress]: true,
        [CustomAlertsState.Done]: false,
        [CustomAlertsState.ManuallyClosed]: false,
    }
}

export type CustomAlertsIndexCustomAlertsStateFilter = {
    [key in CustomAlertsState]: boolean
}

// CHANGES
export interface CustomAlertHistory {
    customalert: Customalert
    history: History[]
    success: boolean
    _csrfToken: any
}


export interface History {
    state_time: string
    timeAgoInWords: string
    user: boolean
    customalert_comment: {
        id: any
        customalert_id: any
        user_id: any
        comment: any
        entry_time: any
        user: {
            id: any
            firstname: any
            lastname: any
        }
    }

    state: number
}

// CheckHoststatusForAcknowledgements
export interface CheckHoststatusForAcknowledgementsRequest {
    hostIds: string[]
}

export interface CheckHoststatusForAcknowledgementsResponse {
    all_hosts: any[]
    canSubmitExternalCommands: boolean
    _csrfToken: any
}

//
export interface CustomalertServiceHistory extends PaginateOrScroll {
    history: {
        message: string
        state: number
        modified: string
        timeAgoInWords: string
        customalert_statehistory: CustomalertStatehistory[]
    }[]
    success: boolean
    _csrfToken: any
}

export interface CustomalertStatehistory {
    state_time: string
    timeAgoInWords: string
    user: boolean
    customalert_comment: {
        id: number
        customalert_id: number
        user_id: number
        comment: string
        entry_time: string
        user: {
            id: number
            firstname: string
            lastname: string
        }
    }
    state: number
}


