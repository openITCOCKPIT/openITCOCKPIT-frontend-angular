import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { HostEntity } from '../hosts/hosts.interface';
import { AgentConfig } from './agentconfig.interface';

/**********************
 *    Pull action     *
 **********************/

export interface AgentconnectorPullParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string
}

export function getDefaultAgentconnectorPullParams(): AgentconnectorPullParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': ''
    }
}

export interface AgentconnectorPullRoot extends PaginateOrScroll {
    agents: PullAgent[]
    _csrfToken: string
}

export interface PullAgent {
    id: number
    host_id: number
    port: number
    use_https: boolean
    insecure: boolean
    use_autossl: boolean
    autossl_successful: boolean
    use_push_mode: boolean
    basic_auth: boolean
    host: HostEntity // All pull agents are assigend to a host
    allow_edit: boolean
}

/**********************
 *    Push action     *
 **********************/

export interface AgentconnectorPushParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string,
    'filter[hasHostAssignment]': string,
}

export function getDefaultAgentconnectorPushParams(): AgentconnectorPushParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': '',
        'filter[hasHostAssignment]': '',
    }
}

export interface AgentconnectorPushRoot extends PaginateOrScroll {
    agents: PushAgent[]
    _csrfToken: string
}

export interface PushAgent {
    id: number
    uuid: string
    hostname: string
    ipaddress: string
    remote_address: string
    http_x_forwarded_for: any
    last_update: string
    Hosts?: HostEntity
    Agentconfigs: {
        host_id?: number
    }
    allow_edit: boolean
}

/*************************
 * Push Satellite action *
 *************************/

export interface AgentconnectorPushSatelliteParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Hosts.name]': string,
    'filter[hasHostAssignment]': string,
}

export function getDefaultAgentconnectorPushSatelliteParams(): AgentconnectorPushSatelliteParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Hosts.name',
        page: 1,
        direction: 'asc',
        'filter[Hosts.name]': '',
        'filter[hasHostAssignment]': '',
    }
}

export interface AgentconnectorPushSatelliteRoot extends PaginateOrScroll {
    agents: PushAgentSatellite[]
    _csrfToken: string
}

export interface PushAgentSatellite {
    id: number
    uuid: string
    hostname: string
    ipaddress: string
    remote_address: string
    http_x_forwarded_for: any
    last_update: string
    container_ids?: string
    Hosts?: HostEntity
    Agentconfigs: {
        host_id?: number
    }
    Satellites: {
        id: number
        name: string
    }
    allow_edit: boolean
}

/**********************
 * showOutput action  *
 **********************/
export interface AgentconnectorShowOutputParams {
    angular: true,
    id: number, // hostId or push_agents.id in push mode
    mode: AgentModes
}

export interface AgentconnectorShowOutputRoot {
    host: HostEntity
    config: AgentConfig
    outputAsJson: string
    pushAgentUuid?: string
    _csrfToken: string
}

export enum AgentModes {
    Pull = 'pull',
    Push = 'push',
    PushSatellite = 'push_satellite'
}
