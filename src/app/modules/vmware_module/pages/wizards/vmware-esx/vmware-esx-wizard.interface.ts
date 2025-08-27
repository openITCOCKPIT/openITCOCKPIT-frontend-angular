import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface VmwareEsxWizardGet extends WizardGet {
    vmwareuser: string
    vmwarepass: string
    vcenter: string
}

// WIZARD POST
export interface VmwareEsxWizardPost extends WizardPost {
    vmwareuser: string
    vmwarepass: string
    vcenter: string
    typeId: string
}
