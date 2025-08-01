import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface VmwareDatastoresWizardGet extends WizardGet {
    vmwareuser: string
    vmwarepass: string
    vcenter: string
}

// WIZARD POST
export interface VmwareDatastoresWizardPost extends WizardPost {
    vmwareuser: string
    vmwarepass: string
    vcenter: string
    typeId: string
}
