import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface NetAppWizardGet extends WizardGet {
    netappuser: string
    netapppass: string
}


// WIZARD POST
export interface NetAppWizardPost extends WizardPost {
    netappuser: string
    netapppass: string
}
