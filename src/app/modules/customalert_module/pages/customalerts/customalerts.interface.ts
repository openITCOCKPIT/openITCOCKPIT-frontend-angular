// Get custom alerts
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { formatDate } from '@angular/common';
import { getUserDate } from '../../../../services/timezone.service';

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
    Servicetemplates: {
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

    // These fields are only for the API request, not for bookmarks and front-end!
    'recursive': boolean,
    'filter[Customalerts.message]': string,
    'filter[Customalerts.state][]': number[],
    'filter[Hosts.container_id][]': number[],
    'filter[Hosts.name]': string,
    'filter[servicename]': string,
    'filter[from]': string,
    'filter[to]': string,
}

export interface CustomAlertsIndexFilter {
    Customalerts: {
        message: string
        state: [
            boolean,
            boolean,
            boolean,
            boolean
        ],
    },
    Hosts: {
        container_id: number[]
        name: string
    },
    servicename: string
    from: string,
    to: string,
    recursive: boolean,
}

export interface LoadContainersRoot {
    containers: SelectKeyValue[]
    _csrfToken: string
}

export function getDefaultCustomAlertsIndexParams(): CustomAlertsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Customalerts.created',
        page: 1,
        direction: 'desc',

        // Just ignore these fields, they will be filled in CustomalertsService
        'recursive': false,
        'filter[Customalerts.message]': '',
        'filter[Customalerts.state][]': [],
        'filter[Hosts.container_id][]': [],
        'filter[Hosts.name]': '',
        'filter[servicename]': '',
        'filter[from]': '',
        'filter[to]': '',
    }
}

export function getDefaultCustomAlertsIndexFilter(): CustomAlertsIndexFilter {
    let now: Date = getUserDate();
    // From: 6 months / 180 days ago
    let fromStr: string = formatDate(new Date(now.getTime() - 86400000 * 30 * 6), 'yyyy-MM-ddTHH:mm', 'en-US');
    // To: Tomorrow
    let toStr: string = formatDate(new Date(now.getTime() + 86400000), 'yyyy-MM-ddTHH:mm', 'en-US');

    return {
        Customalerts: {
            message: '',
            state: [
                true,
                true,
                false,
                false
            ],
        },
        Hosts: {
            container_id: [],
            name: ''
        },
        servicename: '',
        from: fromStr,
        to: toStr,
        recursive: false,
    }
}

// ANNOTATE
export interface AnnotateParams {
    setAnnotationAsHostAcknowledgement: boolean
    setAnnotationAsServiceAcknowledgement: boolean
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

export interface CustomAlertsWidgetFilter {
    Customalerts: {
        state: number
        state_since: string | null
    }
}

export interface CustomAlertsWidget {
    config: CustomAlertsWidgetFilter
    statusCount: number
    ACL: {
        customalerts: {
            index: boolean
        }
    }
    _csrfToken: any
}

export function getCustomAlertsWidgetParams(): CustomAlertsWidgetFilter {
    return {
        Customalerts: {
            state: 0,
            state_since: null
        }
    };
}
