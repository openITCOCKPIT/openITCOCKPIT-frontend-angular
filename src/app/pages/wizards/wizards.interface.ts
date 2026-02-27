import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { GenericValidationError } from '../../generic-responses';
import {
    ImportedHostsToServicetemplate
} from '../../modules/import_module/pages/importedhosts/importedhosts.interface';
import { Commandargument, TemplateCheckCommand } from '../hosttemplates/hosttemplates.interface';

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
    second_url: string
    selected_os: undefined | string
    active: boolean
}

export interface DeprecatedWizards {
    deprecatedWizards: { [key: string]: WizardElement }
    possibleDeprecatedWizards: { [key: string]: WizardElement }
}

// Host Select Validation
export interface ValidateInputFromAngularPost {
    Host: {
        id: any
    }
}


//
export interface LoadHostsByStringRoot {
    hosts: SelectKeyValue[]
    additionalInfo: any
    _csrfToken: string
}


// WIZARD POST
export interface WizardPost {
    host_id: number
    services: ServiceForWizard[]
}

export interface ServiceForWizard {
    createService: boolean
    description: string
    host_id: number
    name: string
    servicecommandargumentvalues: Servicecommandargumentvalue[]
    servicetemplate_id: number
}

export interface Servicecommandargumentvalue {
    commandargument: Commandargument
    commandargument_id: number
    created: string
    id: number
    modified: string
    servicetemplate_id: number
    value: string
}

// WIZARD GET
export interface WizardGet {
    servicetemplates: ServicetemplateForWizard[]
    servicesNamesForExistCheck: { [key: string]: string }
}

export interface ServicetemplateForWizard extends ImportedHostsToServicetemplate {
    check_command: TemplateCheckCommand
    servicetemplatecommandargumentvalues: Servicecommandargumentvalue[]
}


// WIZARD EDIT
export interface WizardGetAssignments {
    wizardAssignments: WizardAssignments
    servicetemplates: SelectKeyValue[]
    _csrfToken: string
}

// WIZARD EDIT POST
export interface WizardAssignments {
    image: string
    title: string
    category: string[]
    description: string
    directive: string
    necessity_of_assignment: boolean
    uuid: string
    id: number
    selected_os: any
    state: string
    type_id: string
    servicetemplates: {
        _ids: number[]
    }
}

// WIZARD SNMP POST

export interface SNMPWizardPost extends WizardPost {
    authPassword: string
    authProtocol: string
    privacyPassword: string
    privacyProtocol: string
    securityLevel: string
    securityName: string
    snmpCommunity: string
    snmpVersion: string
}

// SNMP Discovery for Wizards
export interface WizardDiscovery {
    success: boolean
    errors: GenericValidationError | undefined
    _csrfToken: any
}

export interface WizardDiscoveryItem {
    key: number
    value: {
        number: string
        name: string
    }
}
