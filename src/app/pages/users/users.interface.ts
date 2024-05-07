export interface UserLocaleOption {
    i18n: string
    name: string
}

export interface UserDateformatsRoot {
    dateformats: UserDateformat[]
    defaultDateFormat: string
}

export interface UserDateformat {
    key: string
    value: string
}
