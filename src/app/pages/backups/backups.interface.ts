export interface StartBackupResponse {
    backup: {
        backupRunning: boolean
        error: boolean
    }
    _csrfToken: string
}

export interface CheckBackupFinishedResponse {
    backupFinished: {
        finished: boolean,
        error: boolean,
        backup_files: {
            [key: string]: string
        }
    }
    _csrfToken: string
}

export interface BackupIndexResponse {
    backup_files: {
        [key: string]: string
    }
    _csrfToken: string
}

export interface StartRestoreBackupResponse {
    backup: {
        backupRunning: boolean
    }
    _csrfToken: string
}
