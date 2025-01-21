export interface DynamicalFormFields {
    [key: string]: DynamicalFormField
}

export interface DynamicalFormField {
    type: string
    class: string
    label: string
    help: string
    placeholder: number
    required: boolean
    id: string
    ngModel: string
    key: string
    options?: DynamicalFormFieldOption[]
}

export interface DynamicalFormFieldOption {
    id: string
    value: string
    name: string
}
