import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface VmwareEsxDirectlyWizardGet extends WizardGet {
    username: string
    password: string
    vcenter: string
}

// WIZARD POST
export interface VmwareEsxDirectlyWizardPost extends WizardPost {
    username: string
    password: string
    vcenter: string
    typeId: string
}
