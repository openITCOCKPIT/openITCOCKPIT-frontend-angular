import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { Container } from '../containers/containers.interface';
import { OrganizationalchartUserRoles } from './organizationalcharts.enum';
import { SelectKeyValuePathWithDisabled } from '../../layouts/primeng/select.interface';

/**********************
 *    Index action    *
 **********************/
export interface OrganizationalChartsIndexRoot extends PaginateOrScroll {
    all_organizationalcharts: OrganizationalChart[]
    _csrfToken: string
}

export interface OrganizationalChart {
    id?: number
    name: string
    description: string
    created: string
    modified: string
    allowEdit?: boolean
    allowView?: boolean
}


export function getDefaultOrganizationalChartsIndexParams(): OrganizationalChartsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'OrganizationalCharts.name',
        page: 1,
        direction: 'asc',
        'filter[OrganizationalCharts.name]': '',
        'filter[OrganizationalCharts.description]': ''
    }
}


export interface OrganizationalChartsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[OrganizationalCharts.name]': string
    'filter[OrganizationalCharts.description]': string
}


/**********************
 *  Add / Edit action *
 **********************/

export interface LoadContainersRoot {
    tenants: SelectKeyValuePathWithDisabled[]
    locations: SelectKeyValuePathWithDisabled[]
    nodes: SelectKeyValuePathWithDisabled[]
}

export interface OrganizationalChartsPost {
    id?: number
    name: string
    description: string
    created?: string
    modified?: string,
    organizational_chart_connections: OcConnection[]
    organizational_chart_nodes: OrganizationalChartsTreeNode[]
}

export interface OcConnection {
    id: number | string // numeric id in edit - UUIDv4 in add
    organizational_chart_input_node_id: number | string // numeric id in edit - UUIDv4 in add
    organizational_chart_output_node_id: number | string // numeric id in edit - UUIDv4 in add
    created?: string
    modified?: string,
}

export interface OrganizationalChartsTreeNode {
    id?: number | string // numeric id in edit - UUIDv4 in add
    uuid: string
    organizational_chart_id?: number // empty in add
    container_id: number
    recursive: boolean
    x_position: number
    y_position: number
    created?: string
    modified?: string
    users: OrganizationalChartsTreeNodeUser[]
    container?: Container
}

export interface OrganizationalChartsTreeNodeUser {
    id: number
    usergroup_id?: number
    email?: string
    firstname?: string
    lastname?: string
    position?: null | string
    company?: null | string
    department?: null | string
    phone?: null | number
    timezone?: string
    i18n?: string
    dateformat?: string
    is_active?: boolean
    _joinData: {
        id?: number
        user_id?: number
        organizational_chart_node_id?: number
        user_role: OrganizationalchartUserRoles
    }
}
