export interface Administrators {
}

export interface AdministratorsDebugRootResponse {
    interfaceInformation: AdministratorsDebugInterfaceInformation
    processInformation: AdministratorsDebugProcessInformation
    renderGraph: boolean
    cpuLoadHistoryInformation: {
        "1": {
            [key: string]: number
        }
        "5": {
            [key: string]: number
        }
        "15": {
            [key: string]: number
        }
    }
    currentCpuLoad: AdministratorsDebugCurrentCpuLoad
    serverInformation: AdministratorsDebugServerInformation
    memory: {
        memory: AdministratorsDebugMemory,
        swap: AdministratorsDebugSwap
    }
    diskUsage: AdministratorsDebugDiskUsage[]
    gearmanStatus: {
        [key: string]: AdministratorsDebugGearmanStatus
    }
    emailInformation: AdministratorsDebugEmailInformation
    userInformation: AdministratorsDebugUserInformation,
    logoHtmlPath: string
    _csrfToken: string
}

export interface AdministratorsDebugInterfaceInformation {
    systemname: string
    version: string
    oitc_is_debugging_mode: boolean
    edition: string
    path_for_config: string
    path_for_backups: string
    command_interface: string
    monitoring_engine: string
}

export interface AdministratorsDebugProcessInformation {
    gearmanReachable: boolean
    isGearmanWorkerRunning: boolean
    isNdoInstalled: boolean
    isStatusengineInstalled: boolean
    isStatusenginePerfdataProcessor: boolean
    backgroundProcesses: AdministratorsDebugBackgroundProcesses
}

export interface AdministratorsDebugBackgroundProcesses {
    isNagiosRunning: boolean
    isNdoRunning: boolean
    isStatusengineRunning: boolean
    isNpcdRunning: boolean
    isOitcCmdRunning: boolean
    isSudoServerRunning: boolean
    isNstaRunning: boolean
    isGearmanWorkerRunning: boolean
    isPushNotificationRunning: boolean
    isNodeJsServerRunning: boolean
}

export interface AdministratorsDebugCurrentCpuLoad {
    "1": number
    "5": number
    "15": number
}

export interface AdministratorsDebugServerInformation {
    address: string
    webserver: string
    tls: string
    os_version: string
    kernel: string
    architecture: string
    cpu_processor: string
    cpu_cores: number
    php_version: string
    php_memory_limit: string
    php_max_execution_time: string
    php_extensions: string[]
    containerized: string // Yes no but with translation
    isContainer: boolean
    LsbRelease: string // codename "trusty" or "focal" etc
    isDebianBased: boolean
    isRhelBased: boolean
}

export interface AdministratorsDebugMemory {
    total: number
    used: number
    free: number
    buffers: number
    cached: number
    percentage: number
    state: 'ok' | 'warning' | 'critical'
}

export interface AdministratorsDebugSwap {
    total: number
    used: number
    free: number
    percentage: number
    state: 'ok' | 'warning' | 'critical'
}

export interface AdministratorsDebugDiskUsage {
    disk: string
    size: string
    used: string
    avail: string
    use_percentage: number
    mountpoint: string
    state: 'ok' | 'warning' | 'critical'
}

export interface AdministratorsDebugGearmanStatus {
    jobs: string
    running: string
    worker: string
}

export interface AdministratorsDebugGearmanStatusForAngular {
    name: string     // Name of Gearman Queue
    jobs: number     // How many jobs are in the queue
    running: number  // How many jobs are currently running
    worker: number   // How many workers are available
}

export interface AdministratorsDebugEmailInformation {
    transport: string
    host: string
    port: number
    username: any
    test_mail_address: string
}

export interface AdministratorsDebugUserInformation {
    user_agent: string
    user_os: string
    user_remote_address: string
}
