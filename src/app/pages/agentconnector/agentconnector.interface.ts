import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { HostEntity } from '../hosts/hosts.interface';
import { AgentConfig } from './agentconfig.interface';
import { ServicetemplateCommandArgument } from '../servicetemplates/servicetemplates.interface';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

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

/**********************
 *   Wizard action    *
 **********************/
export interface AgentconnectorWizardLoadHostsByStringParams {
    'angular': true,
    'filter[Hosts.name]': string,
    'selected[]'?: number[],
    'pushAgentId'?: number
}

/*****************************
 *   Wizard config action    *
 *****************************/

export interface AgentconnectorAgentConfigRoot {
    config: AgentConfig
    host: HostEntity
    isNewConfig: boolean
    satellite?: AgentconnectorAgentConfigSatellite
    _csrfToken: string
}

export interface AgentconnectorAgentConfigSatellite {
    id: number
    name: string
    address: string
}

/*****************************
 *   Wizard install action   *
 *****************************/
export interface AgentconnectorWizardInstallRoot {
    config: AgentConfig,
    host: HostEntity,
    config_as_ini: string
}

/*****************************
 *   Wizard AutoTls action   *
 *****************************/
export interface AgentconnectorWizardAutoTlsRoot {
    config: AgentConfig,
    host: HostEntity,
    connection_test: AgentconnectorAutoTlsConnectionTest,
    satellite_task_id: null | number
    _csrfToken: string
}

export interface AgentconnectorAutoTlsConnectionTest {
    status: string,
    error: string,
    guzzle_error: string,
    oitc_errno: number
}

export interface AgentconnectorAutoTlsSatelliteTaskResponse {
    task: {
        id: number
        satellite_id: number
        task: string
        status: number
        result: null | string
        error: null | string
        modified: string
        created: string
    }
    _csrfToken: string
}

/**********************************
 *   Wizard Select Agent action   *
 **********************************/
export interface AgentconnectorSelectAgentRoot {
    config: AgentConfig,
    host: HostEntity,
    pushAgents: AgentconnectorSelectPushAgent[],
    selectedPushAgentId: number
    _csrfToken: string
}

export interface AgentconnectorSelectPushAgent {
    id: number
    agent_uuid: string
    name: string
}

/**********************************
 *  Wizard create services action *
 **********************************/

export interface AgentconnectorCreateServiceRoot {
    config: AgentConfig,
    host: HostEntity,
    services: AgentServicesForCreate,
    connection_test: null | AgentconnectorAutoTlsConnectionTest,
    _csrfToken: string
}


export interface AgentServicesForCreate {
    // Keep the same order as in https://github.com/openITCOCKPIT/openITCOCKPIT/blob/development/src/itnovum/openITCOCKPIT/Agent/AgentResponseToServices.php#L101
    // Single services (AgentServiceForCreate) will become checkboxes and arrays (AgentServiceForCreate[]) will become a multi select
    system_uptime: AgentServiceForCreate
    memory: AgentServiceForCreate
    swap: AgentServiceForCreate
    cpu_percentage: AgentServiceForCreate
    system_load: AgentServiceForCreate
    sensors: AgentServiceForCreate[]
    disk_io: AgentServiceForCreate[]
    disks: AgentServiceForCreate[]
    disks_free: AgentServiceForCreate[]
    net_io: AgentServiceForCreate[]
    net_stats: AgentServiceForCreate[]
    processes: AgentServiceForCreate[]
    systemd_services: AgentServiceForCreate[]
    launchd_services: AgentServiceForCreate[]
    windows_services: AgentServiceForCreate[]
    windows_eventlog: AgentServiceForCreate[]
    customchecks: AgentServiceForCreate[]
    docker_running: AgentServiceForCreate[]
    docker_cpu: AgentServiceForCreate[]
    docker_memory: AgentServiceForCreate[]
    libvirt: AgentServiceForCreate[]
    ntp: AgentServiceForCreate
}


export interface AgentServiceForCreate {
    servicetemplate_id: number
    name: string
    servicecommandargumentvalues: ServicetemplateCommandArgument[]
    host_id: number
}

export interface CreateServiceCheckbox {
    service_key: keyof AgentServicesForCreate,
    checkboxValue: boolean,
    service: AgentServiceForCreate
}

export type CreateServicesMultiSelect = {
    [key in keyof AgentServicesForCreate]?: CreateServiceMultiSelect
};

export interface CreateServiceMultiSelect {
    selectedIndicies: number[]
    options: SelectKeyValue[]
    services: AgentServiceForCreate[],
    length: number
}

export interface CreateAgentServicesPostResponse {
    services: {
        _ids: number[]
    },
    success: boolean,
    _csrfToken: string
}
