export interface HighlightPattern {
    highlight: RegExp;
    className: string;
}

export interface DefaultMacros {
    category: string;
    class: string;
    macros: Macro[];
}

export interface Macro {
    macro: string;
    description: string;
}

export interface AutocompleteItem {
    value: string;
    description: string;
}
