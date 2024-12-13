export interface ConnectionOperator {
    id: string
    from: string
    to: string
}

export interface EvcTreeValidationErrors {
    [key: string | number]: boolean
}
