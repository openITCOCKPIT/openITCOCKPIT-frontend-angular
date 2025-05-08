export interface ResourcesWidgetResponse {
    resources: ResourcesWidgetOverview
    deadline: string
    deadlineExceeded: boolean
    _csrfToken: any
}

export interface ResourcesWidgetOverview {
    status_overview: number[]
    resource_ids: number[][]
    total: number
}

export interface ResourcegroupsCronjobWidgetResponse {
    resources: ResourcesWidgetOverview
    deadline: string
    deadlineExceeded: boolean
    cronjobStatus: ResourcegroupsCronjobStatus
    _csrfToken: any
}

export interface ResourcegroupsCronjobStatus {
    success: number
    failed: number
    total: number
    successIds: number[]
    failedIds: number[]
    totalIds: number[]
}
