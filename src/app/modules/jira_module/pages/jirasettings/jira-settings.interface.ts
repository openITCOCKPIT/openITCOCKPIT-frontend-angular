import { JiraType } from './jira.enums';
import { SelectKeyValueString } from '../../../../layouts/primeng/select.interface';

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
    created?: string
    modified?: string
    jira_projects: JiraProject[]
}

export interface JiraProject {
    id?: number
    jira_settings_id?: number
    project_key: string             // PX
    project_id: string              // 10001
    is_default: boolean
    issue_type_id: string              // 10105
    issue_type_name: string            // Task
    close_transition_name: string
    close_transition_id: string
    created?: string
    modified?: string
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
    value: string   // Project X (PX),
    issue_types: SelectKeyValueString[]
}

export interface LoadJiraProjectDetailsResponse {
    details: {
        issueTypes: SelectKeyValueString[]
    },
    error: null | string
    _csrfToken: null | string
}

export interface ProjectDetails {
    [key: string]: {
        issueTypes: SelectKeyValueString[]
    }
}
