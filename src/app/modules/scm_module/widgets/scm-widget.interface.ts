import { GenericIdAndName } from '../../../generic.interfaces';

export interface ResourcesWidgetResponse {
    resources: ResourcesWidgetOverview
    _csrfToken: any
}

export interface ResourcesWidgetOverview {
    status_overview: number[]
    resource_ids: number[][]
    deadlines: Deadline[]
    total: number
}

export interface ResourcegroupsCronjobWidgetResponse {
    resources: ResourcesWidgetOverview
    timerangeArrives: boolean
    cronjobStatus: ResourcegroupsCronjobStatus
    deadlines: Deadline[]
    _csrfToken: any
}

export interface Deadline {
    key: string
    resourcegroups: GenericIdAndName[]
    exceeded: boolean
    timerangeArrives?: boolean
}

export interface ResourcegroupsCronjobStatus {
    success: number
    pending: number
    failed: number
    total: number
    successIds: number[]
    pendingIds: number[]
    failedIds: number[]
    totalIds: number[]
}
