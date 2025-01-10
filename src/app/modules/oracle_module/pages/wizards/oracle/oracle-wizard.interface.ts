import { WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface OracleWizardGet extends WizardGet {
    dbuser: string
    dbpass: string
}

// WIZARD POST
export interface OracleWizardPost extends WizardPost {
    dbuser: string
    dbpass: string
}
