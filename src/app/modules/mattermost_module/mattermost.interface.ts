import { GenericValidationError } from  '../../generic-responses';

export interface GetMattermostSettings {
    mattermostSettings: MattermostSettings,
    _csrfToken: any
}

export interface MattermostSettingsPostResponse {
    mattermostSettings: MattermostSettings
    error: GenericValidationError | null
}

export interface MattermostSettings {
    webhook_url: string,
    two_way: boolean,
    apikey: string,
    use_proxy: boolean
}
