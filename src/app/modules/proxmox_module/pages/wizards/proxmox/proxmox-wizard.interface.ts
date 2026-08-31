import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface ProxmoxWizardGet extends WizardGet {
    pveUsername: string
    pveApiTokenName: string
    pveApiTokenSecret: string
    pveNodeName: string
    pvePort: number
}


// WIZARD POST
export interface ProxmoxWizardPost extends WizardPost {
    pveUsername: string
    pveApiTokenName: string
    pveApiTokenSecret: string
    pveNodeName: string
    pvePort: number
    storageServices: any[] | undefined
}
