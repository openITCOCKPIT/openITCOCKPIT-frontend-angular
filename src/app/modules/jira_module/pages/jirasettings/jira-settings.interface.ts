import { JiraType } from './jira.enums';

export interface JiraSettingsGetResponse {
    settings: {
        JiraSettings: JiraSettingsPost
    },
    _csrfToken: null | string
}

export interface JiraSettingsPost {
    id?: number,
    jira_url: string
    api_key: string
    jira_type: JiraType
    ignore_ssl_certificate: boolean
    use_proxy: boolean
    enable_two_way: boolean
    created: string
    modified: string
    jira_projects: JiraProject[]
}

export interface JiraProject {
    id?: number
    jira_settings_id?: number
    priority_1: string
    priority_2: string
    priority_3: string
    priority_4: string
    priority_5: string
    //priority_default: 'ITNPRIO'
    issue_type: string
    close_transition_name: string
    close_transition_id: string
    created: string
    modified: string
}

export interface LoadJiraProjectParams {
    jira_url: string
    api_key: string
    jira_type: JiraType
    ignore_ssl_certificate: boolean
    use_proxy: boolean
}

export interface LoadJiraProjectsResponse {
    projects: JiraProjectSelect[]
    error: string | null
}

export interface JiraProjectSelect {
    key: string     // PX
    id: string      // 10001
    value: string   // Project X (PX)
}

