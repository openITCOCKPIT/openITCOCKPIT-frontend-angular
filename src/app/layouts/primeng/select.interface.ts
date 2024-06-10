// Used for select boxes
export interface SelectKeyValue {
    key: number,
    value: string
}

export interface SelectKeyValueWithDisabled {
    key: number,
    value: string,
    disabled?: boolean
}

export interface SelectKeyValueWithDisabledWithGroup {
    label: string,
    items: SelectKeyValueWithDisabled[]
}
