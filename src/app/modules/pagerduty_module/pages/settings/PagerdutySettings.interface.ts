export interface PagerdutySettingsGet {
    settings: {
        PagerdutySettings: PagerdutySettings
    }
    _csrfToken: any
}

export interface PagerdutySettingsPost {
    PagerdutySettings: PagerdutySettings
}

export interface PagerdutySettings {
    api_key: string
    api_url: string
    created: string
    id: number
    integration_key: string
    modified: string
    two_way: boolean
    use_proxy: boolean
}
