import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface VmwarehorizonWizardGet extends WizardGet {
    vmwareuser: string
    vmwarepass: string
    vmwaredomain: string
}

// WIZARD POST
export interface VmwarehorizonWizardPost extends WizardPost {
    vmwareuser: string
    vmwarepass: string
    vmwaredomain: string
}
