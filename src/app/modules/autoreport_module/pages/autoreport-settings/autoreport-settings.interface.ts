import { GenericValidationError } from '../../../../generic-responses';

export interface DefaultAutoreportSettings {
    key: string,
    value: {
        value: number | string,
        info: string
    }
}

export interface AllAutoreportSettings {
    id: number
    configuration_option: number,
    store_path: string,
    notification_emails: string,
}

export interface AutoreportSettingsRoot {
    all_autoreport_settings: AllAutoreportSettings,
    default_autoreport_settings: DefaultAutoreportSettings[],
}

export interface AutoreportSettingsPostResponse {
    autoreportSettings: AllAutoreportSettings
    error: GenericValidationError | null
}

