export interface ScmSettingsIndex {
    scm_settings: ScmSettingsPost
    _csrfToken: string
}

export interface ScmSettingsPost {
    deadline: string
    reminder_time: number
    allow_overwriting: number
    require_user_assigment: number
    id: number
}
