export interface EventcorrelationWidgetConfigRootResponse {
    host_id: number | null
    _csrfToken: string | null
    config: EventcorrelationWidgetConfig
}

export interface EventcorrelationWidgetConfig{
    type: 'tree' | 'table'
    direction: 'LEFT_TO_RIGHT' | 'TOP_TO_BOTTOM' | 'RIGHT_TO_LEFT' | 'BOTTOM_TO_TOP'
}
