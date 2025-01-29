import { GenericValidationError } from '../../../generic-responses';
import { PagerdutySettings } from '../../pagerduty_module/pages/settings/PagerdutySettings.interface';

export interface OpenstreetmapIndexRoot {
    locations: Locations[],
    emptyLocations: Locations[],
    locationPoints: number[][],
    _csrfToken: string | null
}

export interface Locations {
    id: number,
    latitude: number,
    longitude: number,
    description: string,
    container: {
        name: string,
        id: number
    },
    colorcode: number,
    isEmpty: boolean
}

export interface OpenstreetmapIndexParams {


}

export interface OpenstreetmapAcls {
    hosts:{index: boolean}
    location: {edit: boolean}
    services:{index: boolean}
}

export interface OpenstreetmapSettings {
    hide_empty_locations: number
    hide_not_monitored_locations: number
    highlight_down_ack: number
    id: number
    reload_interval: number
    server_url: string
    state_filter: number
    titleResetButton?: string
}

export interface OpenstreetmapRequestSettings {
    settings: OpenstreetmapSettings
}

export interface OpenstreetmapAclSettingsRoot {
    acl: OpenstreetmapAcls
    settings: OpenstreetmapSettings
    _csrfToken: string | null
}

export interface OpenstreetmapIndexParams {
    'angular': boolean,
    'includedLocationId[]': number[],
    'OpenstreetmapSetting[hide_empty_locations]': number | null,
    'OpenstreetmapSetting[hide_not_monitored_locations]': number | null,
    'OpenstreetmapSetting[state_filter]': number | null
}

export interface OpenstreetmapSettingsPostResponse {
    settings: OpenstreetmapSettings
    error: GenericValidationError | null
}

export interface OpenstreetmapSettingsFilter {
    state_filter: number | null,
        filter: {
        up_ok: number,
            warning: number,
            down_critical: number,
            unreachable_unknown: number
    },
    id?: number | null,
    server_url?: string | null,
    reload_interval?: number | null,
    hide_empty_locations: number | null,
    hide_not_monitored_locations: number |null
    highlight_down_ack?: number | null
}

export interface FilterTemplate {
    up_ok: number,
    warning: number,
    down_critical: number,
    unreachable_unknown: number
}




