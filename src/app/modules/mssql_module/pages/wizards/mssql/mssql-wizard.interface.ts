import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface MssqlWizardGet extends WizardGet {
    dbuser: string
    dbpass: string
}

// WIZARD POST
export interface MssqlWizardPost extends WizardPost {
    dbuser: string
    dbpass: string
}
