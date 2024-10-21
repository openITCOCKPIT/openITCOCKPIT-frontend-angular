import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { ServicetemplateEntity } from '../servicetemplates/servicetemplates.interface';

/**********************
 *    Index action    *
 **********************/
export interface AgentchecksIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Agentchecks.name]': string
    'filter[Servicetemplates.template_name]': string
}

export function getDefaultAgentchecksIndexParams(): AgentchecksIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Agentchecks.name',
        page: 1,
        direction: 'asc',
        'filter[Agentchecks.name]': '',
        'filter[Servicetemplates.template_name]': ''
    }
}

export interface AgentchecksIndexRoot extends PaginateOrScroll {
    all_agentchecks: AllAgentcheck[]
    _csrfToken: string
}

export interface AllAgentcheck {
    id: number
    name: string
    plugin_name: string
    servicetemplate_id: number
    created: string
    modified: string
    servicetemplate: ServicetemplateEntity
    allow_edit: boolean
}
