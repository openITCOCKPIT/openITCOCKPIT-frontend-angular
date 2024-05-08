export interface UserLocaleOption {
    i18n: string
    name: string
}

export interface UserDateformatsRoot {
    dateformats: UserDateformat[]
    defaultDateFormat: string
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

export interface LoadUsersByContainerIdPost {
    containerIds: number[]
}
