import {
    TacticalOverviewHostConfig,
    TacticalOverviewServiceConfig
} from '../../../../pages/dashboards/widgets/tactical-overview-services-widget/tactical-overview-services-widget.interface';

export interface EventcorrelationsSummaryWidgetConfigRootResponse {
    host_id: number | null
    _csrfToken: string | null
    config: EventcorrelationsSummaryWidgetConfig
}


export interface EventcorrelationsSummaryWidgetConfig {
    Host: TacticalOverviewHostConfig
    Service: TacticalOverviewServiceConfig
    Hostgroup: {
        _ids: number[]
        keywords: string
        not_keywords: string
    }
    Servicegroup: {
        _ids: number[]
        keywords: string
        not_keywords: string
    }
    servicepriority: number[]
}
