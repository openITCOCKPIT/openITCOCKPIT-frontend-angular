import { WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET

export interface Servicecommandargumentvalue {
    commandargument: Commandargument
    commandargument_id: number
    created: string
    id: number
    modified: string
    servicetemplate_id: number
    value: string
}

export interface Commandargument {
    command_id: number
    created: string
    human_name: string
    id: number
    modified: string
    name: string
}


// WIZARD POST
export interface FortigateFirewallWizardPost extends WizardPost {
    authPassword: string
    authProtocol: string
    interfaces: N0[]
    privacyPassword: string
    privacyProtocol: string
    securityLevel: string
    securityName: string
    snmpCommunity: string
    snmpVersion: string
}

export interface N0 {
    createService: boolean
    description: string
    host_id: number
    name: string
    servicecommandargumentvalues: Servicecommandargumentvalue[]
    servicetemplate_id: number
}
