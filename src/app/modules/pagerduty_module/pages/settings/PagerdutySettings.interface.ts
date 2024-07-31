import { GenericValidationError } from '../../../../generic-responses';

export interface PagerdutySettingsGet {
    settings: {
        PagerdutySettings: PagerdutySettings
    }
    _csrfToken: any
}

export interface PagerdutySettingsPost {
    PagerdutySettings: PagerdutySettings
}

export interface PagerdutySettingsPostResponse {
    settings: PagerdutySettings
    errors: GenericValidationError | null
}

export interface PagerdutySettings {
    api_key: string
    api_url: string
    created: string
    id: number | null
    integration_key: string
    modified: string
    two_way: boolean
    use_proxy: boolean
}
