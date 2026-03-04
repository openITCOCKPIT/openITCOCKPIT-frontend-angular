import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface ProxmoxWizardGet extends WizardGet {
    pveUsername: string
    pveApiTokenName: string
    pveApiTokenSecret: string
}


// WIZARD POST
export interface ProxmoxWizardPost extends WizardPost {
    pveUsername: string
    pveApiTokenName: string
    pveApiTokenSecret: string
    storageServices: any[] | undefined
}
