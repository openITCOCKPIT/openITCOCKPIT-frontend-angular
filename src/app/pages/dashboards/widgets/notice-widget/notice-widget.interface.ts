export interface NoticeWidgetResponse {
    config: NoticeWidgetConfig
    htmlContent: string
    _csrfToken: string
}

export interface NoticeWidgetConfig {
    note: string
}
