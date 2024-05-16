export interface CronjobsIndex {
    cronjobs: CronjobDetails[]
    _csrfToken: string
}

export interface CronjobDetails {
    Cronjob: Cronjob
    Cronschedule: Cronschedule
}

export interface Cronjob {
    id: number
    task: string
    plugin: string
    interval: number
    enabled: boolean
}

export interface Cronschedule {
    id?: number
    cronjob_id?: number
    is_running?: number
    start_time?: string
    end_time?: string
    last_scheduled_usertime?: string
}


export interface CronjobPost {
    id?: number,
    enabled: number,
    interval: number,
    plugin: string,
    task: string
}
