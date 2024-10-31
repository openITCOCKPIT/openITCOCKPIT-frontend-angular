/**********************
 *    Index action    *
 **********************/
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { CheckmkAddressFamily } from '../../checkmk.enums';

export interface ScansRootResponse {
    host: ScansHost
    allMkAgents: SelectKeyValue[]
    selectedAgent: number
    addressFamily: CheckmkAddressFamily
    snmp_config: ScansSnmpConfig
    _csrfToken: string | null
}

export interface ScansHost {
    id: number
    uuid: string
    name: string
    address: string
    satellite_id: number
    container_id: number
    hosttemplate_id: number
}

export interface ScansSnmpConfig {
    enable_agent: boolean
    enable_snmp: boolean
    version: number
    community: string
    security_level: number
    hash_algorithm: number
    username: string
    password: string
    encryption_algorithm: number
    encryption_password: string
}

export interface ScansPost {
    last_used_mkagents: {
        agent_id: number
    }
    addressFamily: CheckmkAddressFamily
    Mksnmp: ScansSnmpConfig
}

export function getDefaultScansIndexPost(): ScansPost {
    return {
        last_used_mkagents: {
            agent_id: 0 // 0 = default Checkmk Agent
        },
        addressFamily: CheckmkAddressFamily.IPv4Only,  // ip-v4-only, ip-v6-only or ip-v4v6
        Mksnmp: {
            // Default values gets overwritten with server result
            enable_agent: true,
            enable_snmp: false,
            version: 2,
            community: '',
            security_level: 1,
            hash_algorithm: 1,
            username: '',
            password: '',
            encryption_algorithm: 1,
            encryption_password: ''
        }
    }
}

export interface ScansHealthRecoveryResult {
    satTaskId?: number, // Satellite Task ID
    discoveryResult?: CheckmkDiscoveryResult
}

export interface CheckmkDiscoveryResult {
    result: {
        [key: string]: ScansCheckmkItem // Hashmap
    }
    missing_template: {
        [key: string]: ScansCheckmkItem // Hashmap
    }
}

export interface ScansProcessListResult {
    satTaskId?: number, // Satellite Task ID
    MkProcesses?: ScansProcessListDiscoveryResult
}

export interface ScansProcessListDiscoveryResult {
    ps: {
        [key: string]: ScansCheckmkProcess // Hashmap running processes all platforms
    }
    services: {
        [key: string]: ScansCheckmkProcess // Hashmap Windows Services
    }
    "systemd_units.services": {
        [key: string]: ScansCheckmkProcess // Hashmap Systemd Services Linux
    }
}

export interface ScansCheckmkItem {
    checktype: string,
    item: string
    params: string,
    description: string,
    servicetemplate_id: number
}

export interface ScansCheckmkProcess {
    checktype: string,
    item: string
    description: string,
    servicetemplate_id: number
}

export interface ScansSatelliteHealthRecoveryResult {
    pending?: boolean,
    error?: string,
    discoveryResult?: CheckmkDiscoveryResult
}

export interface ScansSatelliteProcessListResult {
    pending?: boolean,
    error?: string,
    MkProcesses?: ScansProcessListDiscoveryResult
}

export interface ScansCreateCheckmkServicesPost {
    Scan: {
        health: string[],
        ps: string[],
        services: string[],
        systemd_units_services: string[], // dot (.) in post name is a bad idea
    },
    overwriteServicetemplateArguments: boolean
}
