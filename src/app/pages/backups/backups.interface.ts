export interface StartBackupResponse {
    backup: {
        backupRunning: boolean
        error: boolean
    }
    _csrfToken: string
}

export interface CheckBackupFinishedResponse {
    backupFinished: {
        backupFinished: boolean,
        error: boolean,
        backup_files: {
            [key: string]: string
        }
    }
    _csrfToken: string
}
