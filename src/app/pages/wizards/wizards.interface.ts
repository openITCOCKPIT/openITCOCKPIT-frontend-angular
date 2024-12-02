import { SelectKeyValue } from '../../layouts/primeng/select.interface';

export interface WizardsIndex {
    wizards: { [key: string]: WizardElement }
    possibleWizards: any[]
    _csrfToken: string
}

export interface WizardElement {
    type_id: string
    uuid: string
    title: string
    description: string
    image: string
    directive: string
    state: string
    category: string[]
    necessity_of_assignment: boolean
    selected_os: undefined | string
}

//
export interface LoadHostsByStringRoot {
    hosts: SelectKeyValue[]
    additionalInfo: any
    _csrfToken: string
}
