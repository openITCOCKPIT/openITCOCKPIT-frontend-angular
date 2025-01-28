import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { ContainerParentCanBeNull } from '../../../../pages/containers/containers.interface';


/**********************
 *    Index action    *
 **********************/
export interface GrafanaUserdashboardsIndexRoot extends PaginateOrScroll {
    all_userdashboards: GrafanaUserdashboardsIndex[]
    _csrfToken: string | null
}

export interface GrafanaUserdashboardsIndex {
    id: number
    container_id: number
    configuration_id: number
    name: string
    tooltip: number
    range: string
    refresh: string
    grafana_uid: string
    grafana_url: string
    container: ContainerParentCanBeNull
    allowEdit: boolean
}

export interface GrafanaUserDashboardsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[GrafanaUserdashboards.name]': string
}

export function getDefaultGrafanaUserDashboardsIndexParams(): GrafanaUserDashboardsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'GrafanaUserdashboards.name',
        page: 1,
        direction: 'asc',
        'filter[GrafanaUserdashboards.name]': ''
    };
}

/*********************
 *    view action    *
 *********************/

export interface GrafanaUserdashboardViewResponse {
    dashboard: {
        id: number
        container_id: number
        configuration_id: number
        name: string
        tooltip: number
        range: string
        refresh: string
        grafana_uid: string
        grafana_url: string
    }
    allowEdit: boolean
    dashboardFoundInGrafana: boolean
}

export interface GrafanaUserdashboardViewIframeUrlResponse {
    dashboardFoundInGrafana: boolean,
    iframeUrl: string,
    _csrfToken: string | null
}
