export interface SystemsettingsCategories {
    SUDO_SERVER: Systemsetting[]
    WEBSERVER: Systemsetting[]
    MONITORING: Systemsetting[]
    SYSTEM: Systemsetting[]
    FRONTEND: Systemsetting[]
    CHECK_MK: Systemsetting[]
    ARCHIVE: Systemsetting[]
    INIT: Systemsetting[]
    TICKET_SYSTEM: Systemsetting[]
    SYSTEM_HEALTH: Systemsetting[]
}

export interface Systemsetting {
    id: number
    key: string
    value: string
    info: string
    section: string
    created: string
    modified: string
    alias: string
}
