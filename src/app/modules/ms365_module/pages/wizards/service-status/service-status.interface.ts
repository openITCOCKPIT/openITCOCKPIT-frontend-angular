import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface Ms365ServiceStatusWizardGet extends WizardGet {
    tenantId: string
    clientId: string
    clientSecret: string
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

export interface Commandargument {
    command_id: number
    created: string
    human_name: string
    id: number
    modified: string
    name: string
}


// WIZARD POST
export interface Ms365ServiceStatusWizardPost extends WizardPost {
    tenantId: string
    clientId: string
    clientSecret: string
}

export interface Ms365ServiceStatusWizardPost {
    host_id: number
}

export interface Ms365ServiceDiscovery {
}
