import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { Container } from '../containers/containers.interface';
import { OrganizationalchartUserRoles } from './organizationalcharts.enum';

/**********************
 *    Index action    *
 **********************/
export interface OrganizationalChartsIndexRoot extends PaginateOrScroll {
    all_organizationalcharts: OrganizationalChart[]
    _csrfToken: string
}

export interface OrganizationalChart {
    id?: number
    name: number
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

export interface OrganizationalChartsPost {
    id?: number
    name: string
    description: string
    created?: string
    modified?: string
}

export interface OrganizationalChartsTreeNode {
    id?: number | string // numeric id in edit - UUIDv4 in add
    parent_id: null | number | string  // numeric id in edit - UUIDv4 in add
    lft?: number
    rgt?: number
    organizational_chart_id?: number // empty in add
    container_id: number
    x_position: number
    y_position: number
    users_to_organizational_chart_structures: OrganizationalChartsTreeNodeUser[]
    container?: Container
}

export interface OrganizationalChartsTreeNodeUser {
    id?: number
    user_id: number
    organizational_chart_structure_id?: number
    is_manager: 0 | 1
    user_role: OrganizationalchartUserRoles

    // only relevant in edit mode
    user?: {
        id: number
        usergroup_id: number
        email: string
        password: string
        firstname: string
        lastname: string
        position: null | string
        company: null | string
        department: null | string
        phone: null | number
        timezone: string
        i18n: string
        dateformat: string
        is_active: boolean
    }
}

export interface OrganizationalChartsTreeConnection {
    uuid: string
    fInputId: string
    fOutputId: string
}
