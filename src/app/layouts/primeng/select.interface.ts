// Used for select boxes

export interface SelectItem<T = any> {
    label?: string;
    value: T;
    styleClass?: string;
    icon?: string;
    title?: string;
    disabled?: boolean;
}

export interface SelectKeyValue {
    key: number,
    value: string
}

export interface SelectKeyValueWithDisabled {
    key: number,
    value: string,
    disabled?: boolean
}

export interface SelectItemOptionGroup {
    label: string;
    value?: any;
    disabled?: boolean
    items: SelectItem[];
}

export interface SelectKeyValueString {
    key: string,
    value: string
}

export interface SelectKeyValueOptGroup {
    value: string | number
    items: SelectKeyValueString[]
}

