export interface GrafanaIframeUrlForDatepicker {
    GrafanaDashboardExists: boolean,
    iframeUrl: string
}

/************************************
 *    Configuration index action    *
 ***********************************/

export interface GrafanaConfigurationGetResponse {
    grafanaConfiguration: GrafanaConfigurationPost
    _csrfToken: string | null
}

export interface GrafanaConfigurationPost {
    id: number
    api_url: string
    api_key: string
    graphite_prefix: string
    use_https: number
    use_proxy: number
    ignore_ssl_certificate: number
    dashboard_style: 'light' | 'dark'
    created?: string
    modified?: string
    Hostgroup: number[]
    Hostgroup_excluded: number[]
}

export interface GrafanaConnectionTestResult {
    status: {
        status: boolean,
        msg?: {
            message: string
        }
    }
    _csrfToken: string | null
}

export interface GrafanaConnectionSaveResult {
    grafanaConfiguration: {
        id: number
        api_url: string
        api_key: string
        graphite_prefix: string
        use_https: number
        use_proxy: number
        ignore_ssl_certificate: number
        dashboard_style: string
        created: string
        modified: string,
        grafana_configuration_hostgroup_membership: GrafanaConfigurationHostgroupMembership[]
    }
    _csrfToken: string | null
}

export interface GrafanaConfigurationHostgroupMembership {
    configuration_id: number
    hostgroup_id: number
    excluded: number
    id: number
}
