import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

export interface AdditionalHostInformationResult {

    response: {
        result?: null // only null if the CMDB is offline - does not exist in successful for itop or idoit responses
        status: boolean // true = online, false = offline

        // idoit related fields
        objectInformation?: IdoitObjectInformation
        model?: { // idoit only
            manufacturer: string
            title: string
        }
        global?: { // idoit only
            title: string
            cmdb_status: string
            created_by: string
            description: string
            changed_by: string
        }
        location?: { // idoit only
            location_path: string
            title: string
            type_title: string
            option: string
            insertion: string
        }
        ipv4Address?: { // idoit only
            hostname: string
            title: string
            ip: string
            description: string
            manufacturer?: string
        },
        contractAssignments: IdoitContractAssignment[],
        applications?: IdoitApplication[]
        memory?: IdoitMemory[]
        cpu?: IdoitCpu[]

        // itop related fields
        customClass?: boolean
        general_information?: ItopGeneralInformation
        server_details?: ItopServerDetails
        network_component?: ItopNetworkComponent
        network_other_information?: ItopNetworkOtherInformation
        location_information?: ItopLocationInformation
        operations?: ItopOperations
        contacts_list?: ItopContact[]

        accounting?: ItopAccountingIdoitAccounting

        // all CMDB types
        externalLink?: string

    },
    data_source: 'itop' | 'idoit',
}


/*******************
 * i-doit          *
 *******************/
export interface IdoitObjectInformation {
    id: number
    title: string
    type_title: string
    status: number
    cmdb_status_title: string
    created: string
    updated: string
    image: string
}

export interface IdoitContractAssignment {
    objID: string
    connected_contract_id: string
    connection_id: string
    title: string
    contract_start: string
    contract_end: string
    reaction_rate: any
    description: string
    details: {
        contract: {
            id: number
            title: string
            type_title: string
            status: number
            cmdb_status_title: any
            created: any
            updated: any
            image: any
        },
        contract_details: {
            costs: string
            cost_calculation: string
            product: string
            reaction_rate: string
            contract_status: string
            start_date: string
            end_date: string
            end_type: string
            payment_period: string
        },
        contact?: {
            contact: any
            website: any
            type_title: string
            role: string
        }
    }
}

export interface IdoitAccounting {
    inventory_no?: string
    acquirementdate?: string
    operation_expense?: string
    operation_expense_interval?: string
    invoice_no?: string
    order_no?: string
    guarantee_period?: string
    guarantee_period_unit?: string
    guarantee_period_status?: string
    guarantee_period_base?: string
}

export interface IdoitApplication {
    title: string
    application_type: string
    application_priority?: string
}

export interface IdoitMemory {
    title: string
    manufacturer: string
    capacity: number
    unit: string
    total_capacity: string
    counter: number
}

export interface IdoitCpu {
    title: string
    manufacturer: string
    type: string
    frequency: number
    frequency_unit: string
    counter: number
}

/*******************
 * iTop            *
 *******************/

export interface ItopDefaultValue {
    default: boolean   // is this an itop default feild
    value: string | number | null // the value of the field
}

export interface ItopGeneralInformation {
    id: ItopDefaultValue
    name: ItopDefaultValue
    hostname: ItopDefaultValue
    riskclass: ItopDefaultValue
    serviceclass: ItopDefaultValue
    hwsupportserviceclass: ItopDefaultValue
    dnsdomain: ItopDefaultValue
    organization_name: ItopDefaultValue
    short_description: ItopDefaultValue
    description: ItopDefaultValue
    finalclass: ItopDefaultValue
    management_ip: ItopDefaultValue
    status: ItopDefaultValue
    business_criticity: ItopDefaultValue
    applicationsolution_list: {
        default: boolean,
        value: string[]
    }


    [key: string]: any
}

export interface ItopServerDetails {
    brand_name: ItopDefaultValue
    model_name: ItopDefaultValue
    fullhardwaretype: ItopDefaultValue
    os_family: ItopDefaultValue
    os_version: ItopDefaultValue
    management_url: ItopDefaultValue
    iosversion_name: ItopDefaultValue
    cpu_type: ItopDefaultValue
    cpu_count: ItopDefaultValue
    cpu_cores: ItopDefaultValue
    ram: ItopDefaultValue
    asset_number: ItopDefaultValue
    serialnumber: ItopDefaultValue
    networkdevicetype_name: ItopDefaultValue
}

export interface ItopNetworkComponent {
    scope: ItopDefaultValue
    wanedgetype: ItopDefaultValue
}

export interface ItopNetworkOtherInformation {
    provider_name: ItopDefaultValue
    monitoring_template: ItopDefaultValue
    service_ci_dummy_ci: ItopDefaultValue
    service_level_service_ci: ItopDefaultValue
    operational_risk_class: ItopDefaultValue
}

export interface ItopLocationInformation {
    location_name: ItopDefaultValue
    buildingroom: ItopDefaultValue
    hierachie: ItopDefaultValue
    rack: ItopDefaultValue
    rack_position: ItopDefaultValue
    rack_units: ItopDefaultValue
}

// TypeScript sucks
export interface ItopAccountingIdoitAccounting extends ItopAccounting, IdoitAccounting {
}


export interface ItopAccounting {
    provider_hw?: ItopDefaultValue
    provider_os?: ItopDefaultValue
    psp_operations_department?: ItopDefaultValue
    provider_contract?: ItopDefaultValue
    provider_sla?: ItopDefaultValue
}

export interface ItopOperations {
    production_critical: ItopDefaultValue
    environment: ItopDefaultValue
    server_role: ItopDefaultValue
    service_window: ItopDefaultValue
    uptime: ItopDefaultValue
    virtualhost: ItopDefaultValue
    external_id: ItopDefaultValue
    provider_name: ItopDefaultValue
    lastospatch: ItopDefaultValue
    nextospatch: ItopDefaultValue
}

export interface ItopContact {
    id: ItopDefaultValue,
    email: ItopDefaultValue,
    name: ItopDefaultValue
}

/***********************
 *   Dependency Tree   *
 ***********************/
export interface DependencyTreeApiResult {
    treeData: DependencyTreeTreeData
    connected: {
        status: boolean
        result?: any
        msg?: { // Connection error messages
            [key: string]: string
        }
    }
    external_system: ExternalSystemEntity
}

export interface DependencyTreeTreeData {
    result?: any, // null if not connected - otherwise not present
    status?: boolean, // false if not connected - otherwise not present
    objects: VisObject[]
    relations: VisRelation[]
    identifiers_to_resolve?: string[]
    source?: string
    direction?: string
}

export interface VisObject {
    key: any
    class: string
    id: string
    title: string
    group: string
    label: string
    identifier: string
    external_link: string

    host?: {
        id: number
        uuid: string
        name: string
        disabled: number,
        hoststatus: VisHiststatus
    }
    hostgroup?: {
        identifier: string
        Hostgroups: {
            id: number
            uuid: string
        }
        Containers: {
            name: string
        }
        hoststatus: VisHiststatus
    }
}

export interface VisRelation {
    from: string
    to: string
    color: {
        inherit: string
    }
    arrows: string
}

export interface VisHiststatus {
    summary_state: 'text-primary' | 'bg-primary' | 'up' | 'bg-up' | 'ok' | 'bg-ok' | 'warning' | 'bg-warning' | 'down' | 'bg-down' | 'critical' | 'bg-critical' | 'unreachable' | 'bg-unreachable' | 'unknown' | 'bg-unknown' | 'disabled' | 'info'
    summary_state_name: string
    in_downtime: boolean
    is_acknowledged: boolean
    is_disabled: boolean
}

export interface ExternalSystemEntity {
    id: number
    name: string
    description: string
    container_id: number
    api_url?: string
    api_user?: string
    api_password?: string
    api_key?: string
    use_https: number
    use_proxy: number
    ignore_ssl_certificate: number
    system_type: string
    json_data: string
    custom_data: string
    created: string
    modified: string
}

export interface Applications {
    applications: Application[]
    response: {
        success: boolean
        message: string
    }
    hasRootPrivileges: boolean
    message: string
    _csrfToken: any
}

export interface Application {
    identifier: string
    id: string
    class: string
    name: string
    description: string
    CIs: Ci[]
}

export interface Ci {
    identifier: string
    id: string
    class: string
    name: string
}

export interface ExternalSystemsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[ExternalSystems.id][]': [],
    'filter[ExternalSystems.name]': string
    'filter[ExternalSystems.description]': string
    'filter[ExternalSystems.api_url]': boolean
}

export function getDefaultExternalSystemsIndexParams(): ExternalSystemsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'ExternalSystems.name',
        page: 1,
        direction: 'asc',
        'filter[ExternalSystems.id][]': [],
        'filter[ExternalSystems.name]': '',
        'filter[ExternalSystems.description]': '',
        'filter[ExternalSystems.api_url]': false
    }
}

export interface ExternalSystemsIndexRoot extends PaginateOrScroll {
    externalSystems: ExternalSystem[]
    _csrfToken: any
}

export interface ExternalSystem {
    id: number
    name: string
    api_url: string
    use_https: number
    use_proxy: number
    ignore_ssl_certificate: number
    container_id: number
    description: string
    system_type: string
    container: string
    allowEdit: boolean
    connected: {
        status: boolean
        msg: {
            message: string
        }
    }
}
