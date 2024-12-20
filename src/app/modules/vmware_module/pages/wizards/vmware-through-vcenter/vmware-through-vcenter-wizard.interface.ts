import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface VmwareThroughVcenterWizardGet extends WizardGet {
    username: string
    password: string
    vcenter: string
}

// WIZARD POST
export interface VmwareThroughVcenterWizardPost extends WizardPost {
    username: string
    password: string
    vcenter: string
    typeId: string
}
