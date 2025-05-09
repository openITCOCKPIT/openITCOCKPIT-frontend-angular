import { CronjobPriorities } from './cronjob.enum';

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
    priority: CronjobPriorities
    created: null | string
    modified: null | string
}

export interface Cronschedule {
    id?: number
    cronjob_id?: number
    is_running?: number
    start_time?: string
    end_time?: string
    execution_time: null | number
    last_scheduled_usertime?: string
    last_execution_time_human?: string
}


export interface CronjobPost {
    id?: number,
    enabled: number,
    interval: number,
    plugin: string,
    task: string,
    priority: CronjobPriorities
}
