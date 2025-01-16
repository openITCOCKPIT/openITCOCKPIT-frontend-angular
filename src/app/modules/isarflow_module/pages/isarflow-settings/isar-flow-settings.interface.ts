import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';

export interface LoadIsarFlowSettingsResponse {
    isarflowSettings: IsarFlowSettingsPost
    externalSystems: SelectKeyValue[]
    _csrfToken: string | null
}

export interface IsarFlowSettingsPost {
    id?: number
    webserver_address: string
    webserver_port: number
    use_https: number
    shared_secret_1: string
    shared_secret_2: string
    authentication_mode: string
    language_code: string
    duration: number
    granularity: number | null
    if_view: string
    export_deviceip_with_interfaceindex: string
    ip_network_a_traffic_direction: string
    bgp_adjacent_as: string
    bgp_as_number: string
    cb_qos_interface: string
    ip_cos: string
    ip_cos_group: string
    ip_version: string
    ip_view_a: string
    ip_view_a_traffic_direction: string
    ip_view_b: string
    snmp_interface: string
    primary_unit: string
    session_type: string
    jitter_probe: null | string
    created: string
    modified: string
    external_systems: {
        _ids: number[]
    }
}
