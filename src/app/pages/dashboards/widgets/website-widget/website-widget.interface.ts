export interface WebsiteWidgetResponse {
    config: WebsiteWidgetConfig
    _csrfToken: string
}

export interface WebsiteWidgetConfig {
    url: string
}
