export interface MacroIndexRoot {
    all_macros: MacroIndex[]
    _csrfToken: string
}

export interface MacroIndex {
    id: number
    name: string
    value: string
    description: string
    password: number
    created: string
    modified: string
}

export interface AvailableMacroNamesParams {
    include: string,
    angular: true
}

export interface MacroPost {
    Macro: {
        name: string | null,
        value: string
        description: string
        password: number
    }
}
