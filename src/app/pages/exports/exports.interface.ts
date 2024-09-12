import {
    SatelliteEntityWithSatelliteStatus
} from '../../modules/distribute_module/pages/satellites/satellites.interface';

export interface ExportsIndexResult {
    gearmanReachable: boolean
    isGearmanWorkerRunning: boolean
    exportRunning: boolean
    tasks: ExportTask[]
    useSingleInstanceSync: boolean
    satellites: SatelliteEntityWithSatelliteStatus[]
    _csrfToken: string
}

export interface ExportsBroadcastResult {
    tasks: ExportTask[]
    exportFinished: boolean
    exportSuccessfully: boolean
    successMessage: string
    _csrfToken: string
}

export interface ExportTask {
    id: number
    task: string
    text: string
    finished: number
    successfully: number
    created: string
    modified: string
}

export interface LaunchExportPost {
    empty: true,
    create_backup: number // 1 / 0,
    satellites?: {
        id: number,
        sync_instance: number // 1 / 0
    }[]
}


export interface ExportValidationResult {
    result: {
        nagios: {
            hasError: boolean
            output: string[]
        },
        prometheus: {
            hasError: boolean
            output: string[]
        }
    },
    _csrfToken: string
}


export function resetExportValidation(): ExportValidationResult {
    return {
        result: {
            nagios: {
                hasError: false,
                output: []
            },
            prometheus: {
                hasError: false,
                output: []
            }
        },
        _csrfToken: ''
    }
};
