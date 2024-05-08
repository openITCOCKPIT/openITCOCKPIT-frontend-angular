export interface UserLocaleOption {
    i18n: string
    name: string
}

export interface UserDateformatsRoot {
    dateformats: UserDateformat[]
    defaultDateFormat: string,
    timezones: UserTimezonesSelect[]
}

export interface LoadUsersByContainerIdRoot {
    users: UserByContainer[]
}

export interface UserByContainer {
    key: number
    value: string
}

export interface UserDateformat {
    key: string
    value: string
}

export interface UserTimezoneGroup {
    // Africa / America / Antarctica / Asia / Atlantic / Australia / Europe / Indian / Pacific ...
    [key: string]: UserTimezone
}

export interface UserTimezone {
    // Africa/Abidjan: Abidjan
    [key: string]: string
}

export interface UserTimezonesSelect {
    group: string // Africa / America / Antarctica / Asia / Atlantic / Australia / Europe / Indian / Pacific ...
    value: string // Africa/Abidjan
    name: string // Abidjan
}

export interface LoadUsersByContainerIdPost {
    containerIds: number[]
}
