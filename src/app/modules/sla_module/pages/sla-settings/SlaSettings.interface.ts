export interface SlaSettingsIndexRoot {
    sla_settings: SlaSettingsPost
    _csrfToken: string
}

export interface SlaSettingsPost {
    max_age: number
    id?: number
}


