import { MacroIndex } from "../../pages/macros/macros.interface";

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

export interface Macros {
    defaultMacros: DefaultMacros[];
    macros: MacroIndex[];
}

export interface AutocompleteItem {
    value: string;
    description: string;
}
