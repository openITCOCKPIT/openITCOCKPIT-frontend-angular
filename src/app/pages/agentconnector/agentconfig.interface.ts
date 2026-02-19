export interface AgentConfig {
    string: AgentConfigStringFields
    bool: AgentConfigBoolFields
    int: AgentConfigIntFields
    array: AgentConfigArrayFields
}

export interface AgentConfigStringFields {
    bind_address: string
    username: string
    password: string
    push_oitc_server_url: string
    push_oitc_api_key: string
    operating_system: string
    push_proxy_address: string
    customchecks_path: string
    ssl_certfile: string
    ssl_keyfile: string
    autossl_folder: string
    autossl_csr_file: string
    autossl_crt_file: string
    autossl_key_file: string
    autossl_ca_file: string
    tls_security_level: 'lax' | 'intermediate' | 'modern'
    config_version: string
}

export interface AgentConfigBoolFields {
    enable_push_mode: boolean
    use_proxy: boolean
    enable_remote_config_update: boolean
    use_http_basic_auth: boolean
    push_verify_server_certificate: boolean
    push_enable_webserver: boolean
    push_webserver_use_https: boolean
    use_autossl: boolean
    verify_autossl_expiry: boolean
    use_https: boolean
    use_https_verify: boolean
    enable_packagemanager: boolean
    enable_packagemanager_update_check: boolean
    cpustats: boolean
    memory: boolean
    swap: boolean
    processstats: boolean
    netstats: boolean
    netio: boolean
    diskstats: boolean
    diskio: boolean
    systemdservices: boolean
    launchdservices: boolean
    winservices: boolean
    wineventlog: boolean
    sensorstats: boolean
    dockerstats: boolean
    libvirt: boolean
    userstats: boolean
    ntp: boolean
}

export interface AgentConfigIntFields {
    bind_port: number
    check_interval: number
    push_timeout: number
    packagemanager_check_interval: number
    packagemanager_description_length: number
}

export interface AgentConfigArrayFields {
    win_eventlog_types: string[]
}
