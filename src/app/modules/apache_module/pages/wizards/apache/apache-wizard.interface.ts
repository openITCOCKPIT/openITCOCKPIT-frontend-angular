import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface ApacheWizardGet extends WizardGet {
    pveUsername: string
    pveApiTokenName: string
    pveApiTokenSecret: string
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
export interface ApacheWizardPost extends WizardPost {
    pveUsername: string
    pveApiTokenName: string
    pveApiTokenSecret: string
    storageServices: any[] | undefined
}

