import { GenericValidationError } from '../../../../generic-responses';

export interface GetSlackSettings {
    settings: SlackSettings,
    _csrfToken: any
}

export interface SlackSettingsPostResponse {
    settings: SlackSettings
    error: GenericValidationError | null
}

export interface SlackSettings {
    api_url: string,
    oauth_access_token: string,
    two_way: boolean,
    use_proxy: boolean,
}
