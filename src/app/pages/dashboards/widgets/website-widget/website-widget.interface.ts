export interface WebsiteWidgetResponse {
    config: WebsiteWidgetConfig
    url: string
    _csrfToken: string
}

export interface WebsiteWidgetConfig {
    url: string
}
