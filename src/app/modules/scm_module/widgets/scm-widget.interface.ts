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
